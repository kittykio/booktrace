import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const credentialsSchema = z.object({ email: z.string().trim().email().transform((v) => v.toLowerCase()), password: z.string().min(8).max(72) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: '/login' }, session: { strategy: 'jwt' },
  providers: [Credentials({ credentials: { email: {}, password: {} }, async authorize(raw) {
    const parsed = credentialsSchema.safeParse(raw);
    if (!parsed.success) return null;
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !(await compare(parsed.data.password, user.passwordHash))) return null;
    return { id: user.id, email: user.email, name: user.name };
  } })],
  callbacks: {
    jwt({ token, user }) { if (user?.id) token.userId = user.id; return token; },
    session({ session, token }) { if (session.user) session.user.id = token.userId as string; return session; },
  },
});
