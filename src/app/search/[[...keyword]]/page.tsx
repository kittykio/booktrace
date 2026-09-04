import BookList from '@/components/BookList';
import { Pagination } from '@/components/Pagination';
import { getPaginatedBooksByKeyword } from '@/lib/getter';
import { auth } from '@/auth'; import { redirect } from 'next/navigation';

type Props = { params: Promise<{ keyword?: string[] }>; searchParams: Promise<{ page?: string }> };

export default async function BookResult({ params, searchParams }: Props) {
  if (!(await auth())) redirect('/login'); const { keyword = [] } = await params; const query = await searchParams;
  const activePage = Math.max(1, Number(query.page ?? '1') || 1);
  const limit = 4;
  const { books, total } = await getPaginatedBooksByKeyword(decodeURIComponent(keyword.join(' ')), activePage, limit);

  return (
    <>
      {books.length ? <BookList books={books} preserveMetadata /> : <div className="card text-center">No books matched. Try a title, author, or ISBN.</div>}
      <Pagination activePage={activePage} limit={limit} total={total} />
    </>
  );
}
