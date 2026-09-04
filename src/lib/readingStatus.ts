import type { BookType } from '@/types/BookType';

export const readingStatusLabels: Record<NonNullable<BookType['status']>, string> = {
  WANT_TO_READ: 'Want to read',
  READING: 'Currently reading',
  READ: 'Finished',
  PAUSED: 'Paused',
  DNF: 'Did not finish',
};
