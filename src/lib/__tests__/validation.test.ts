import { describe, expect, it } from 'vitest';
import { deleteAccountSchema, goalSchema, libraryEntrySchema, profileSchema, registerSchema } from '../validation';
describe('validation', () => {
  it('normalizes library metadata', () => { const result = libraryEntrySchema.parse({ bookId: 'abc', title: 'Book', author: 'Author', price: '', publisher: '', published: '', image: '/no-image.png', status: 'READ', rating: '5', tags: 'Fiction, fiction, Design', favorite: 'on', startedAt: '', finishedAt: '2026-01-02', memo: ' Great ' }); expect(result.tags).toEqual(['fiction', 'design']); expect(result.rating).toBe(5); expect(result.favorite).toBe(true); });
  it('rejects an invalid rating', () => { expect(libraryEntrySchema.safeParse({ bookId: 'abc', status: 'READ', rating: '9', tags: '', startedAt: '', finishedAt: '', memo: '' }).success).toBe(false); });
  it('requires secure-enough registration inputs', () => { expect(registerSchema.safeParse({ name: 'A', email: 'bad', password: 'short' }).success).toBe(false); });
  it('bounds reading goals', () => { expect(goalSchema.safeParse({ year: 2026, target: 0 }).success).toBe(false); });
  it('validates account settings', () => { expect(profileSchema.safeParse({ name: 'Reader' }).success).toBe(true); expect(deleteAccountSchema.safeParse({ password: '' }).success).toBe(false); });
});
