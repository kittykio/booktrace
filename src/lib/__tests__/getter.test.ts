import { afterEach, describe, expect, it, vi } from 'vitest';
import { getBook, getPaginatedBooksByKeyword } from '../getter';

afterEach(() => vi.restoreAllMocks());

describe('book providers', () => {
  it('maps partial Google Books data safely', () => {
    expect(getBook({ id: '1', volumeInfo: { title: 'Accessible Systems', pageCount: 10 } }).author).toBe('Unknown author');
  });

  it('falls back to Open Library when Google Books reaches its quota', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}', { status: 429 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ numFound: 1, docs: [{ key: '/works/OL1W', title: 'Fallback Book', author_name: ['Ada Reader'] }] }), { status: 200 }));
    const result = await getPaginatedBooksByKeyword('fallback', 1, 4);
    expect(result.books[0]).toMatchObject({ id: 'openlibrary:OL1W', title: 'Fallback Book' });
  });

  it('returns an empty result when both providers fail', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    await expect(getPaginatedBooksByKeyword('offline', 1, 4)).resolves.toEqual({ books: [], total: 0 });
  });
});
