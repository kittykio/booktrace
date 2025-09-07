'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const range = (start: number, end: number, step: number = 1) => {
  let output = [];
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

  return (
    <div className="flex gap-1 justify-center items-center my-2">
      {activePage !== 1 && (
        <>
          <Link href={`${pathname}/?page=${1}`} className="hover:bg-secondary-200 px-2">
            «
          </Link>
          <Link
            href={`${pathname}/?page=${activePage - 1}`}
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
            href={`${pathname}/?page=${num}`}
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
            href={`${pathname}/?page=${activePage + 1}`}
            className="hover:bg-secondary-200 px-2"
          >
            ›
          </Link>
          <Link
            href={`${pathname}/?page=${Math.ceil(total / limit)}`}
            className="hover:bg-secondary-200 px-2"
          >
            »
          </Link>
        </>
      )}
    </div>
  );
}
