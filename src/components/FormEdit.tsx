'use client';

import { addReview, removeReview } from '@/lib/actions';
import { useRouter } from 'next/navigation';

type Props = {
  src: { id: string; read: string; memo: string };
};

export default function FormEdit({ src: { id, read, memo } }: Props) {
  const router = useRouter();

  return (
    <form action={addReview} onSubmit={() => router.replace('/')}>
      <input type="hidden" name="id" defaultValue={id} />
      <div className="mb-3">
        <label htmlFor="read">
          <span className="font-bold">Date</span> :
        </label>
        <input
          type="date"
          id="read"
          name="read"
          className="px-2 text-black block bg-gray-100 border-2 border-secondary-100 rounded focus:bg-white focus:outline-none focus:border-red-500"
          defaultValue={read}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="memo">
          <span className="font-bold">Memo</span>
          <span className="italic"> (Summary/Thoughts) </span>:
        </label>
        <textarea
          id="memo"
          name="memo"
          rows={5}
          autoFocus
          className="text-black caret-black px-2 block bg-gray-100 border-2 border-secondary-100 w-full rounded focus:bg-white focus:outline-none focus:border-red-500"
          defaultValue={memo}
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-secondary-100 text-white rounded px-4 py-2 mr-2 hover:bg-secondary-200"
      >
        Submit
      </button>
      <button
        type="submit"
        className="border-2 border-secondary-200 text-white rounded px-4 py-2 hover:bg-secondary-200"
        formAction={removeReview}
      >
        Delete
      </button>
    </form>
  );
}
