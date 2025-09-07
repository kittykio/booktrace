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
    router.push(`/search/${txtKeyword.current?.value}`);
  };

  const handleClear = () => {
    router.push(`/search`);
  };

  return (
    <>
      <form className="mb-4 flex justify-center">
        <input
          placeholder="Click Search..."
          ref={txtKeyword}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              e.preventDefault();
              handleSearch();
            }
          }}
          autoFocus
          className="bg-gray-100 text-black caret-black border border-gray-600 rounded mr-2 p-2 focus:bg-white focus:outline-none focus:border-red-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="bg-secondary-100 rounded px-4 py-2 hover:bg-secondary-200"
        >
          Search
        </button>
      </form>
      {searchValue === 'search' ? (
        ''
      ) : (
        <div className="mb-4 flex gap-2 items-center hover:cursor-pointer" onClick={handleClear}>
          Clear <RxCrossCircled size={20} />
        </div>
      )}
      {children}
    </>
  );
}
