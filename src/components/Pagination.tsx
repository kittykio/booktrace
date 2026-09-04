'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const range = (start: number, end: number, step: number = 1) => {
  const output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export function Pagination({
  activePage,
  limit,
  total,
}: {
  activePage: number;
  limit: number;
  total: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex gap-1 justify-center items-center my-2">
      {activePage !== 1 && (
        <>
          <Link href={pageHref(1)} className="hover:bg-secondary-200 px-2" aria-label="First page">
            «
          </Link>
          <Link
            href={pageHref(activePage - 1)}
            aria-label="Previous page"
            className="hover:bg-secondary-200 px-2"
          >
            ‹
          </Link>
        </>
      )}
      {limit < total &&
        range(1, Math.ceil(total / limit) + 1).map((num) => (
          <Link
            key={num}
            href={pageHref(num)}
            aria-current={activePage === num ? 'page' : undefined}
            className={`${
              activePage === num ? 'font-bold bg-secondary-100' : ''
            } hover:bg-secondary-200 px-2`}
          >
            {num}
          </Link>
        ))}

      {limit * activePage < total && (
        <>
          <Link
            href={pageHref(activePage + 1)}
            aria-label="Next page"
            className="hover:bg-secondary-200 px-2"
          >
            ›
          </Link>
          <Link
            href={pageHref(Math.ceil(total / limit))}
            aria-label="Last page"
            className="hover:bg-secondary-200 px-2"
          >
            »
          </Link>
        </>
      )}
    </div>
  );
}
