import { BookType, BookData } from '@/types/BookType';
import prisma from './prisma';

const TIMEOUT = 8_000;
type OpenLibraryDocument = { key?: string; title?: string; author_name?: string[]; publisher?: string[]; first_publish_year?: number; cover_i?: number };

export function getBook(data: BookData): BookType {
  const volume = data.volumeInfo ?? {}; const price = data.saleInfo?.listPrice;
  return { id: data.id, title: volume.title || 'Untitled', author: volume.authors?.join(', ') || 'Unknown author', price: price ? `${price.currencyCode} ${price.amount}` : '', publisher: volume.publisher || '', published: volume.publishedDate || '', image: volume.imageLinks?.thumbnail?.replace('http:', 'https:') || '/no-image.png' };
}

function getOpenLibraryBook(document: OpenLibraryDocument): BookType {
  const workId = document.key?.split('/').pop() ?? '';
  return { id: `openlibrary:${workId}`, title: document.title || 'Untitled', author: document.author_name?.join(', ') || 'Unknown author', price: '', publisher: document.publisher?.[0] || '', published: document.first_publish_year?.toString() || '', image: document.cover_i ? `https://covers.openlibrary.org/b/id/${document.cover_i}-M.jpg` : '/no-image.png' };
}

async function searchOpenLibrary(keyword: string, page: number, limit: number) {
  const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}&fields=key,title,author_name,publisher,first_publish_year,cover_i`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(TIMEOUT) });
  if (!response.ok) throw new Error('Open Library search is unavailable');
  const result = await response.json();
  return { books: (result.docs ?? []).map(getOpenLibraryBook), total: Math.min(result.numFound ?? 0, 100) };
}

export async function getPaginatedBooksByKeyword(keyword: string, page: number, limit: number) {
  const searchTerm = keyword.trim() || 'recommended books'; const apiKey = process.env.GOOGLE_BOOKS_API_KEY; const key = apiKey ? `&key=${encodeURIComponent(apiKey)}` : '';
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&startIndex=${(page - 1) * limit}&maxResults=${limit}&printType=books${key}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(TIMEOUT) });
    if (!response.ok) throw new Error(`Google Books returned ${response.status}`);
    const result = await response.json();
    return { books: (result.items ?? []).map(getBook), total: Math.min(result.totalItems ?? 0, 100) };
  } catch {
    try { return await searchOpenLibrary(searchTerm, page, limit); } catch { return { books: [], total: 0 }; }
  }
}

async function getOpenLibraryBookById(id: string): Promise<BookType> {
  const response = await fetch(`https://openlibrary.org/works/${encodeURIComponent(id)}.json`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(TIMEOUT) });
  if (!response.ok) throw new Error('Book not found');
  const work = await response.json();
  const authorNames = await Promise.all((work.authors ?? []).slice(0, 4).map(async ({ author }: { author?: { key?: string } }) => {
    if (!author?.key) return '';
    try { const authorResponse = await fetch(`https://openlibrary.org${author.key}.json`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(TIMEOUT) }); return authorResponse.ok ? (await authorResponse.json()).name ?? '' : ''; } catch { return ''; }
  }));
  return { id: `openlibrary:${id}`, title: work.title || 'Untitled', author: authorNames.filter(Boolean).join(', ') || 'Unknown author', price: '', publisher: '', published: work.first_publish_date || '', image: work.covers?.[0] ? `https://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg` : '/no-image.png' };
}

export async function getBookById(id: string) {
  if (id.startsWith('openlibrary:')) return getOpenLibraryBookById(id.slice('openlibrary:'.length));
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY; const key = apiKey ? `?key=${encodeURIComponent(apiKey)}` : '';
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}${key}`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(TIMEOUT) });
  if (!response.ok) throw new Error('Book not found'); return getBook(await response.json());
}

export async function getReviewById(userId: string, bookId: string) { return prisma.review.findUnique({ where: { userId_bookId: { userId, bookId } } }); }
export async function getPaginatedReviews(userId: string, page: number, limit: number, status?: string) {
  const allowed = ['WANT_TO_READ', 'READING', 'READ', 'PAUSED', 'DNF']; const where = { userId, ...(status && allowed.includes(status) ? { status: status as never } : {}) };
  const [items, total] = await prisma.$transaction([prisma.review.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: (page - 1) * limit, take: limit }), prisma.review.count({ where })]);
  return { paginatedReviews: items.map((item) => ({ ...item, id: item.bookId })), total };
}
export async function getStats(userId: string, year: number) {
  const [entries, goal] = await Promise.all([prisma.review.findMany({ where: { userId }, select: { status: true, rating: true, finishedAt: true, favorite: true } }), prisma.readingGoal.findUnique({ where: { userId_year: { userId, year } } })]);
  const finished = entries.filter((entry) => entry.status === 'READ' && entry.finishedAt?.getFullYear() === year); const rated = entries.filter((entry) => entry.rating);
  return { total: entries.length, finished: finished.length, reading: entries.filter((entry) => entry.status === 'READING').length, favorites: entries.filter((entry) => entry.favorite).length, averageRating: rated.length ? rated.reduce((sum, entry) => sum + (entry.rating ?? 0), 0) / rated.length : 0, target: goal?.target ?? 12 };
}
