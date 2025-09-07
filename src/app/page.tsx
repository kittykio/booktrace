import { getPaginatedReviews } from '@/lib/getter';
import BookList from '@/components/BookList';
import { Pagination } from '@/components/Pagination';

export const dynamic = 'force-dynamic';

type Props = {
  params: { keyword: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Home({ searchParams }: Props) {
  const activePage = Number(searchParams.page ?? '1');

  const limit = 4;
  const { paginatedReviews, total } = await getPaginatedReviews(activePage, limit);

  return (
    <>
      <h1 className="flex justify-center items-center text-2xl mb-4">Your Records</h1>
      {total === 0 ? (
        <div className="flex justify-center items-center text-xl mt-16">
          There are no records yet!
        </div>
      ) : (
        ''
      )}
      <BookList books={paginatedReviews} />
      <Pagination activePage={activePage} limit={limit} total={total} />
    </>
  );
}
