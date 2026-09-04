import { getPaginatedReviews } from '@/lib/getter';
import BookList from '@/components/BookList';
import { Pagination } from '@/components/Pagination';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { readingStatusLabels } from '@/lib/readingStatus';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ page?: string; status?: string }> };

export default async function Home({ searchParams }: Props) {
  const session = await auth(); if (!session?.user?.id) redirect('/login');
  const query = await searchParams; const activePage = Math.max(1, Number(query.page ?? '1') || 1);
  const profile = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true } });

  const limit = 4;
  const { paginatedReviews, total } = await getPaginatedReviews(session.user.id, activePage, limit, query.status);

  return (
    <>
      <div className="mb-7 pt-5"><p className="mb-2 text-xs font-black uppercase tracking-[.22em] text-coral">{profile ? `${profile.name}’s private library` : 'Your private library'}</p><h1 className="text-4xl font-black tracking-tight sm:text-5xl">Your reading shelf</h1><p className="mt-3 max-w-xl text-ink-muted">Keep the books you want to remember, and see where your reading takes you.</p></div>
      <nav aria-label="Filter library" className="mb-6 flex flex-wrap gap-2">{(['ALL','READING','READ','WANT_TO_READ','PAUSED','DNF'] as const).map((status) => <Link className={`pill ${query.status === status || (!query.status && status === 'ALL') ? 'pill-active' : ''}`} key={status} href={`/?status=${status}`}>{status === 'ALL' ? 'All books' : readingStatusLabels[status]}</Link>)}</nav>
      {total === 0 ? (
        <section className="card py-16 text-center"><p className="mx-auto mb-5 text-5xl" aria-hidden="true">⌁</p><h2 className="text-2xl font-black">Your shelf is ready</h2><p className="mt-2 text-ink-muted">Search for a book to start your private reading log.</p><Link href="/search" className="button mt-5 inline-block">Find a book</Link></section>
      ) : (
        ''
      )}
      <BookList books={paginatedReviews} />
      <Pagination activePage={activePage} limit={limit} total={total} />
    </>
  );
}
