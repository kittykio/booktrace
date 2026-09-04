'use server';
import { compare, hash } from 'bcryptjs';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn, signOut } from '@/auth';
import prisma from './prisma';
import { getBookById } from './getter';
import { deleteAccountSchema, goalSchema, libraryEntrySchema, profileSchema, registerSchema } from './validation';
export type ActionState = { error?: string; success?: string };
const values = (data: FormData) => Object.fromEntries(data.entries());
async function userId() { const session = await auth(); if (!session?.user?.id) redirect('/login'); return session.user.id; }
export async function login(_: ActionState, data: FormData): Promise<ActionState> { try { await signIn('credentials', { ...values(data), redirectTo: '/' }); } catch (error) { if (error instanceof AuthError) return { error: 'Email or password is incorrect.' }; throw error; } return {}; }
export async function register(_: ActionState, data: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse(values(data)); if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check your details.' };
  if (await prisma.user.findUnique({ where: { email: parsed.data.email } })) return { error: 'An account with that email already exists.' };
  const { password, ...profile } = parsed.data; await prisma.user.create({ data: { ...profile, passwordHash: await hash(password, 12) } });
  await signIn('credentials', { email: parsed.data.email, password, redirectTo: '/' }); return {};
}
export async function logout() { await signOut({ redirectTo: '/login' }); }
export async function saveBook(_: ActionState, data: FormData): Promise<ActionState> {
  const ownerId = await userId(); const parsed = libraryEntrySchema.safeParse(values(data));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  try { const { bookId, title, author, price, publisher, published, image, ...entry } = parsed.data;
    let metadata = { title, author, price, publisher, published, image };
    try { const providerBook = await getBookById(bookId); metadata = { title: providerBook.title, author: providerBook.author, price: providerBook.price, publisher: providerBook.publisher, published: providerBook.published, image: providerBook.image }; } catch { /* Validated result metadata keeps saving available during provider outages. */ }
    await prisma.review.upsert({ where: { userId_bookId: { userId: ownerId, bookId } }, update: { ...entry, ...metadata }, create: { ...entry, ...metadata, bookId, userId: ownerId } });
    revalidatePath('/'); revalidatePath('/stats'); return { success: 'Saved to your library.' };
  } catch { return { error: 'We could not save this book. Please try again.' }; }
}
export async function removeBook(data: FormData) { const ownerId = await userId(); const bookId = String(data.get('bookId') ?? ''); if (bookId) await prisma.review.deleteMany({ where: { userId: ownerId, bookId } }); revalidatePath('/'); redirect('/'); }
export async function saveGoal(_: ActionState, data: FormData): Promise<ActionState> { const ownerId = await userId(); const parsed = goalSchema.safeParse(values(data)); if (!parsed.success) return { error: 'Choose a goal between 1 and 1,000 books.' }; await prisma.readingGoal.upsert({ where: { userId_year: { userId: ownerId, year: parsed.data.year } }, update: { target: parsed.data.target }, create: { ...parsed.data, userId: ownerId } }); revalidatePath('/stats'); return { success: 'Goal updated.' }; }

export async function updateProfile(_: ActionState, data: FormData): Promise<ActionState> {
  const ownerId = await userId(); const parsed = profileSchema.safeParse(values(data));
  if (!parsed.success) return { error: 'Your name must be between 2 and 60 characters.' };
  await prisma.user.update({ where: { id: ownerId }, data: parsed.data });
  revalidatePath('/', 'layout'); return { success: 'Profile updated.' };
}

export async function deleteAccount(_: ActionState, data: FormData): Promise<ActionState> {
  const ownerId = await userId(); const parsed = deleteAccountSchema.safeParse(values(data));
  if (!parsed.success) return { error: 'Enter your current password.' };
  const user = await prisma.user.findUnique({ where: { id: ownerId }, select: { passwordHash: true } });
  if (!user || !(await compare(parsed.data.password, user.passwordHash))) return { error: 'Your password is incorrect.' };
  await prisma.user.delete({ where: { id: ownerId } });
  await signOut({ redirectTo: '/login?accountDeleted=true' });
  return {};
}
