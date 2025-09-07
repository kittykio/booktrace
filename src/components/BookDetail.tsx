import { BookType } from '@/types/BookType';
import Image from 'next/image';

export default function BookDetail({ book }: { book: BookType }) {
  return (
    <div className="flex w-full mb-4 bg-white bg-opacity-10 hover:bg-secondary-400">
      <div>
        <Image
          src={book.image}
          alt="Book Image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[120px] h-[160px]"
          priority={true}
        />
      </div>
      <div>
        <ul className="list-none m-2 sm:m-4">
          <li>
            {book.title} ({book.price})
          </li>
          <li>Author: {book.author}</li>
          <li>Publisher: {book.publisher}</li>
          <li>Published Date: {book.published}</li>
        </ul>
      </div>
    </div>
  );
}
