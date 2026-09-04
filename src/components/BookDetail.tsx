import { BookType } from '@/types/BookType';
import Image from 'next/image';
import { readingStatusLabels } from '@/lib/readingStatus';

export default function BookDetail({ book }: { book: BookType }) {
  const isUseful = (value?: string) => {
    const normalized = value?.trim().toLowerCase();
    return Boolean(normalized && !['unknown', 'unknown author', 'i dont know', "i don't know", 'n/a', 'none'].includes(normalized));
  };

  return (
    <article className="group mb-4 flex w-full gap-4 rounded-2xl border border-ink/10 bg-white/70 p-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg sm:p-4">
      <div className="shrink-0 overflow-hidden rounded-xl bg-[#ead8c0] shadow-sm">
        <Image
          src={book.image}
          alt={`Cover of ${book.title}`}
          width={0}
          height={0}
          sizes="100vw"
          className="h-[150px] w-[105px] object-cover transition duration-300 group-hover:scale-[1.03] sm:h-[176px] sm:w-[120px]"
          priority={false}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="py-1 sm:px-2">
          <h2 className="text-lg font-black leading-tight tracking-tight text-ink sm:text-xl">{book.title} {book.favorite ? <span className="text-coral" aria-label="Favorite">★</span> : null}</h2>
          <dl className="mt-2 space-y-1 text-sm text-ink-muted">
            {isUseful(book.author) && <div><dt className="sr-only">Author</dt><dd className="font-medium">by {book.author}</dd></div>}
            {isUseful(book.publisher) && <div className="flex gap-1"><dt className="font-semibold text-ink">Publisher:</dt><dd>{book.publisher}</dd></div>}
            {isUseful(book.published) && <div className="flex gap-1"><dt className="font-semibold text-ink">Published:</dt><dd>{book.published}</dd></div>}
          </dl>
          {book.status && <div className="mt-3"><span className="pill">{readingStatusLabels[book.status]}</span> {book.rating ? <span aria-label={`${book.rating} out of 5 stars`}>{'★'.repeat(book.rating)}</span> : null}</div>}
          {book.tags?.length ? <div className="mt-3 text-sm font-medium text-coral">{book.tags.map((tag) => `#${tag}`).join(' ')}</div> : null}
        </div>
      </div>
    </article>
  );
}
