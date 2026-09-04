import { z } from 'zod';
export const libraryEntrySchema = z.object({
  bookId: z.string().trim().min(1).max(128), status: z.enum(['WANT_TO_READ', 'READING', 'READ', 'PAUSED', 'DNF']),
  title: z.string().trim().min(1).max(500), author: z.string().trim().max(500), price: z.string().trim().max(100),
  publisher: z.string().trim().max(300), published: z.string().trim().max(40),
  image: z.string().trim().max(2000).refine((value) => value.startsWith('/') || URL.canParse(value), 'Invalid cover image'),
  rating: z.union([z.literal(''), z.coerce.number().int().min(1).max(5)]).transform((v) => v === '' ? null : v),
  tags: z.string().max(200).transform((v) => [...new Set(v.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))].slice(0, 8)),
  favorite: z.string().optional().transform((v) => v === 'on'),
  startedAt: z.union([z.literal(''), z.coerce.date()]).transform((v) => v === '' ? null : v),
  finishedAt: z.union([z.literal(''), z.coerce.date()]).transform((v) => v === '' ? null : v), memo: z.string().trim().max(5000),
});
export const registerSchema = z.object({ name: z.string().trim().min(2).max(60), email: z.string().trim().email().transform((v) => v.toLowerCase()), password: z.string().min(8).max(72) });
export const goalSchema = z.object({ year: z.coerce.number().int().min(2000).max(2100), target: z.coerce.number().int().min(1).max(1000) });
export const profileSchema = z.object({ name: z.string().trim().min(2).max(60) });
export const deleteAccountSchema = z.object({ password: z.string().min(1).max(72) });
