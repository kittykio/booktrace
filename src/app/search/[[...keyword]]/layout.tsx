'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';
import { RxCrossCircled } from 'react-icons/rx';

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();

  const txtKeyword = useRef<HTMLInputElement>(null);
  const searchValue = path.split('/').pop();

  const handleSearch = () => {
    const value = txtKeyword.current?.value.trim(); if (value) router.push(`/search/${encodeURIComponent(value)}`);
  };

  const handleClear = () => {
    router.push(`/search`);
  };

  return (
    <>
      <div className="py-8 text-center"><p className="text-xs font-black uppercase tracking-[.22em] text-coral">Discover your next read</p><h1 className="mt-2 text-4xl font-black tracking-tight">Search the shelves</h1></div>
      <form className="mx-auto mb-6 flex max-w-2xl rounded-2xl bg-white p-2 shadow-lg shadow-ink/5 ring-1 ring-ink/10" role="search" onSubmit={(event) => { event.preventDefault(); handleSearch(); }}>
        <label className="sr-only" htmlFor="book-search">Search by title, author, or ISBN</label>
        <input
          id="book-search" placeholder="Title, author, or ISBN"
          ref={txtKeyword}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              e.preventDefault();
              handleSearch();
            }
          }}
          defaultValue={searchValue === 'search' ? '' : decodeURIComponent(searchValue ?? '')}
          className="mr-2 border-0 bg-transparent caret-ink focus:outline-none focus:ring-0"
        />
        <button
          type="submit"
          className="button shrink-0"
        >
          Search
        </button>
      </form>
      {searchValue === 'search' ? (
        ''
      ) : (
        <button className="mb-4 flex gap-2 items-center text-sm font-bold text-ink-muted hover:text-ink" onClick={handleClear}>Clear search <RxCrossCircled aria-hidden size={18} /></button>
      )}
      {children}
    </>
  );
}
