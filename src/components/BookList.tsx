import Link from 'next/link';
import { BookType } from '@/types/BookType';
import BookDetail from './BookDetail';

export default function BookList({ books }: { books: BookType[] }) {
  return (
    <>
      {books.map((book, i) => (
        <Link href={`/edit/${book.id}`} key={i}>
          <div className="hover:bg-green-50">
            <BookDetail book={book} />
          </div>
        </Link>
      ))}
    </>
  );
}
