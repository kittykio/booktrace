import { auth } from '@/auth'; import AuthForm from '@/components/auth/AuthForm'; import { redirect } from 'next/navigation';
export default async function RegisterPage() { if (await auth()) redirect('/'); return <AuthForm mode="register" />; }
