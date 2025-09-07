import BookList from '@/components/BookList';
import { Pagination } from '@/components/Pagination';
import { getPaginatedBooksByKeyword } from '@/lib/getter';

type Props = {
  params: { keyword: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function BookResult({
  params: { keyword = 'React TypeScript' },
  searchParams,
}: Props) {
  const activePage = Number(searchParams.page ?? '1');
  const limit = 4;
  const total = 28;
  const { books } = await getPaginatedBooksByKeyword(keyword, activePage, limit);

  return (
    <>
      <BookList books={books} />
      <Pagination activePage={activePage} limit={limit} total={total} />
    </>
  );
}
