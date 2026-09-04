'use client';
import { useActionState } from 'react';
import { removeBook, saveBook } from '@/lib/actions';
import type { BookType } from '@/types/BookType';
import { readingStatusLabels } from '@/lib/readingStatus';
const statuses = Object.entries(readingStatusLabels) as [NonNullable<BookType['status']>, string][];
const date = (value?: Date | null) => value ? new Date(value).toISOString().slice(0, 10) : '';
export default function FormEdit({ book }: { book: BookType }) {
  const [state, action, pending] = useActionState(saveBook, {});
  return <form action={action} className="card space-y-5" aria-describedby="form-message">
    <input type="hidden" name="bookId" value={book.id} />
    <input type="hidden" name="title" value={book.title} />
    <input type="hidden" name="author" value={book.author} />
    <input type="hidden" name="price" value={book.price} />
    <input type="hidden" name="publisher" value={book.publisher} />
    <input type="hidden" name="published" value={book.published} />
    <input type="hidden" name="image" value={book.image} />
    <div className="grid gap-4 sm:grid-cols-2">
      <label>Status<select name="status" defaultValue={book.status ?? 'WANT_TO_READ'}>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>Rating<select name="rating" defaultValue={book.rating ?? ''}><option value="">Not rated</option>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}</select></label>
      <label>Started<input name="startedAt" type="date" defaultValue={date(book.startedAt)} /></label>
      <label>Finished<input name="finishedAt" type="date" defaultValue={date(book.finishedAt)} /></label>
    </div>
    <label>Tags <span className="hint">Comma-separated, up to 8</span><input name="tags" defaultValue={book.tags?.join(', ') ?? ''} placeholder="fiction, design" /></label>
    <label className="flex-row items-center"><input name="favorite" type="checkbox" defaultChecked={book.favorite} className="h-5 w-5" /> Favorite</label>
    <label>Notes <span className="hint">Up to 5,000 characters</span><textarea name="memo" rows={6} maxLength={5000} defaultValue={book.memo ?? ''} /></label>
    <p id="form-message" role="status" className={state.error ? 'text-red-200' : 'text-green-200'}>{state.error ?? state.success}</p>
    <div className="flex gap-3"><button className="button" disabled={pending}>{pending ? 'Saving…' : 'Save book'}</button>{book.status ? <button className="button-secondary" formAction={removeBook}>Remove</button> : null}</div>
  </form>;
}
