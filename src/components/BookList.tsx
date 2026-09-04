import Link from 'next/link';
import { BookType } from '@/types/BookType';
import BookDetail from './BookDetail';

export default function BookList({ books, preserveMetadata = false }: { books: BookType[]; preserveMetadata?: boolean }) {
  return (
    <>
      {books.map((book) => (
        <Link
          href={preserveMetadata ? { pathname: `/edit/${book.id}`, query: { title: book.title, author: book.author, price: book.price, publisher: book.publisher, published: book.published, image: book.image } } : `/edit/${book.id}`}
          key={book.id}
          aria-label={`Open ${book.title}`}
        >
          <div>
            <BookDetail book={book} />
          </div>
        </Link>
      ))}
    </>
  );
}
