import { BookType, BookData, Result } from '@/types/BookType';
import prisma from './prisma';

export function getBook(bookData: BookData) {
  const title = bookData.volumeInfo?.title;
  const authors = bookData.volumeInfo?.authors;
  const price = bookData.saleInfo?.listPrice;
  const img = bookData.volumeInfo?.imageLinks;
  const publisher = bookData.volumeInfo?.publisher;
  const published = bookData.volumeInfo?.publishedDate;
  const book: BookType = {
    id: bookData.id,
    title: title ? title : '',
    author: authors ? authors.join(',') : '',
    price: `${price ? price.currencyCode : ''} ${price ? price.amount : ''}`,
    publisher: publisher ? publisher : '',
    published: published ? published : '',
    image: img ? img.smallThumbnail : '/no-image.png',
  };
  return book;
}

export async function getPaginatedBooksByKeyword(
  keyword: string,
  activePage: number,
  limit: number,
) {
  const startIndex = activePage === 1 ? activePage - 1 : (activePage - 1) * limit;
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${keyword}&startIndex=${startIndex}&maxResults=${limit}&printType=books`,
  );
  const result = await res.json();
  const books = [];
  for (const b of result.items) {
    books.push(getBook(b));
  }
  return {
    books,
  };
}

export async function getBookById(id: string) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
  const result: BookData = await res.json();
  const book: BookType = getBook(result);
  return book;
}

export async function getReviewById(id: string) {
  return await prisma.reviews.findUnique({
    where: {
      id: id,
    },
  });
}

export async function getPaginatedReviews(activePage: number, limit: number) {
  const reviews: BookType[] = await prisma.reviews.findMany({
    orderBy: {
      read: 'desc',
    },
  });
  const paginatedReviews = reviews.slice((activePage - 1) * limit, activePage * limit);
  const total = reviews.length;
  return { paginatedReviews, total };
}
