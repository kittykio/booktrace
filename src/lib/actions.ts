'use server';

import { redirect } from 'next/navigation';
import prisma from './prisma';
import { getBookById } from './getter';
import { BookType } from '@/types/BookType';

export async function addReview(data: FormData) {
  const book: BookType = await getBookById(data.get('id') as string);
  const input = {
    id: data.get('id') as string,
    title: book.title,
    author: book.author,
    price: book.price,
    publisher: book.publisher,
    published: book.published,
    image: book.image,
    read: new Date(data.get('read') as string),
    memo: data.get('memo') as string,
  };
  await prisma.reviews.upsert({
    update: input,
    create: Object.assign({}, input, { id: data.get('id') as string }),
    where: {
      id: data.get('id') as string,
    },
  });
  redirect('/');
}

export async function removeReview(data: FormData) {
  await prisma.reviews.delete({
    where: {
      id: data.get('id') as string,
    },
  });

  redirect('/');
}
