'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { login, register } from '@/lib/actions';
export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [state, action, pending] = useActionState(mode === 'login' ? login : register, {});
  return <form action={action} className="card mx-auto mt-10 max-w-md space-y-5 sm:mt-20">
    <p className="text-xs font-black uppercase tracking-[.22em] text-coral">Your reading life</p>
    <h1 className="text-3xl font-black tracking-tight">{mode === 'login' ? 'Welcome back' : 'Create your library'}</h1>
    {mode === 'register' && <label>Name<input name="name" required minLength={2} autoComplete="name" /></label>}
    <label>Email<input name="email" type="email" required autoComplete="email" /></label>
    <label>Password<input name="password" type="password" required minLength={8} maxLength={72} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /><span className="hint">At least 8 characters</span></label>
    <p role="alert" className="text-red-200">{state.error}</p>
    <button disabled={pending} className="button w-full">{pending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
    <p className="text-sm">{mode === 'login' ? 'New here?' : 'Already have an account?'} <Link className="underline" href={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Create an account' : 'Sign in'}</Link></p>
  </form>;
}
