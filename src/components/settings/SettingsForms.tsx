'use client';
import { useActionState } from 'react';
import { deleteAccount, updateProfile } from '@/lib/actions';

export default function SettingsForms({ name, email }: { name: string; email: string }) {
  const [profileState, profileAction, profilePending] = useActionState(updateProfile, {});
  const [deleteState, deleteAction, deletePending] = useActionState(deleteAccount, {});
  return <div className="space-y-8">
    <section className="card" aria-labelledby="profile-heading">
      <form action={profileAction} className="space-y-5">
        <h2 id="profile-heading" className="text-2xl font-bold">Profile</h2>
        <label>Name<input name="name" required minLength={2} maxLength={60} defaultValue={name} autoComplete="name" /></label>
        <label>Email<input value={email} disabled aria-describedby="email-note" /></label>
        <p id="email-note" className="hint">Email changes are not supported yet.</p>
        <p role="status" className={profileState.error ? 'text-red-200' : 'text-green-200'}>{profileState.error ?? profileState.success}</p>
        <button className="button" disabled={profilePending}>{profilePending ? 'Saving…' : 'Save profile'}</button>
      </form>
    </section>
    <section className="rounded-2xl border border-red-300 bg-red-50/70 p-6" aria-labelledby="danger-heading">
      <form action={deleteAction} className="space-y-5">
        <div><h2 id="danger-heading" className="text-2xl font-bold text-red-900">Delete account</h2><p className="mt-1 text-red-900/70">Permanently deletes your account, books, notes, tags, ratings, and reading goals. This cannot be undone.</p></div>
        <label>Current password<input name="password" type="password" required autoComplete="current-password" /></label>
        <p role="alert" className="text-red-200">{deleteState.error}</p>
        <button className="rounded-lg bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60" disabled={deletePending}>{deletePending ? 'Deleting…' : 'Permanently delete account'}</button>
      </form>
    </section>
  </div>;
}
