import { auth } from '@/auth';
import SettingsForms from '@/components/settings/SettingsForms';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await auth(); if (!session?.user?.id) redirect('/login');
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true } });
  if (!user) redirect('/login');
  return <div className="mx-auto max-w-2xl space-y-6 pt-8"><div><p className="text-xs font-black uppercase tracking-[.22em] text-coral">Your account</p><h1 className="mt-2 text-4xl font-black tracking-tight">Settings</h1></div><SettingsForms name={user.name} email={user.email} /></div>;
}
