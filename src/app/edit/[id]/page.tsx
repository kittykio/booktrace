import BookDetail from '@/components/BookDetail';
import FormEdit from '@/components/FormEdit';
import { getBookById, getReviewById } from '@/lib/getter';
import { auth } from '@/auth'; import { redirect } from 'next/navigation';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ title?: string; author?: string; price?: string; publisher?: string; published?: string; image?: string }> };

export default async function EditPage({ params, searchParams }: Props) {
  const session = await auth(); if (!session?.user?.id) redirect('/login'); const { id } = await params;
  const review = await getReviewById(session.user.id, id); const fallback = await searchParams;
  let book;
  try { book = await getBookById(id); } catch {
    const source = review ?? fallback;
    if (!source?.title) throw new Error('Book details are unavailable');
    book = { id, title: source.title, author: source.author ?? 'Unknown author', price: source.price ?? '', publisher: source.publisher ?? '', published: source.published ?? '', image: source.image ?? '/no-image.png' };
  }

  return (
    <div className="space-y-5 pt-8">
      <p className="text-xs font-black uppercase tracking-[.22em] text-coral">Book details</p>
      <BookDetail book={book} />
      <FormEdit book={{ ...book, ...review, id: book.id }} />
    </div>
  );
}
