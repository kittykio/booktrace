# Booktrace

A private, full-stack reading companion with a warm, coffeehouse-inspired interface. Booktrace helps readers preserve a meaningful trail of what they read—their reviews, ratings, notes, favorites, reading states, and annual progress.

**Live app:** [kiki-booktrace.vercel.app](https://kiki-booktrace.vercel.app)

## Product highlights

- Private libraries protected by Auth.js credential sessions
- Five reading states, 1–5 ratings, tags, favorites, and reading dates
- Annual goal progress and useful library statistics
- Resilient book discovery with Google Books, automatic Open Library fallback, timeouts, and caching
- Profile settings and password-confirmed account deletion
- Server-side Zod validation and owner-scoped database writes
- Responsive empty/loading/error states and keyboard/screen-reader support
- Vitest coverage for domain validation and external-data mapping
- Custom vector identity and responsive coffee-toned design system

## Stack

Next.js 16 App Router, React 19, TypeScript, PostgreSQL, Prisma 7, Auth.js, Zod, Tailwind CSS, Vitest, and Testing Library.

## Local setup

Requirements: Node.js 22.22+ (Node 22 LTS recommended), npm, and PostgreSQL.

```bash
npm install
cp .env.example .env.local
openssl rand -base64 32
npx prisma migrate deploy
npm run dev
```

Set `DATABASE_URL` in `.env.local`. Never commit database credentials. If credentials have ever been shared outside their intended secret store, rotate them before deploying.

Environment variables:

| Name | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Pooled PostgreSQL connection string from Neon |
| `AUTH_SECRET` | Yes | Random value used to sign Auth.js sessions |
| `GOOGLE_BOOKS_API_KEY` | No | Dedicated Google Books quota; Open Library is the automatic fallback |

Useful commands:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run check
```

## Architecture

Pages are server components by default. Authentication and owner checks occur before private reads, while server actions parse untrusted `FormData` through Zod before any mutation. Every library query includes `userId`; the database also enforces one entry per user/book. JWT sessions avoid a session table while password hashes use bcrypt with cost 12.

Google Books is the primary source for public metadata, with Open Library used automatically during quota or availability failures. A validated snapshot is carried from search and stored with each personal entry, so opening and saving books remains useful during provider outages.

See [the full case study](docs/CASE_STUDY.md) for the product framing, tradeoffs, data model, and next steps.

## Deploy to Vercel

The repository includes `vercel.json`. Vercel installs with `npm ci`, applies committed Prisma migrations, generates the client, and builds Next.js through `npm run vercel-build`.

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the `booktrace` repository.
3. Keep the detected framework as **Next.js** and leave the root directory at the repository root.
4. Add `DATABASE_URL` and `AUTH_SECRET` under **Environment Variables**. Add `GOOGLE_BOOKS_API_KEY` only if you have one.
5. Select **Deploy**. The first build applies `prisma/migrations` to the configured Neon database.
6. Open the deployment, create an account, search for a book, save it, and verify the Settings and Stats pages.

For later releases, commit and push changes to the production branch. Vercel redeploys automatically. Schema changes must always include a committed Prisma migration.

### Deployment safety

- Use the pooled Neon connection string for `DATABASE_URL`.
- Never add `.env` or `.env.local` to Git.
- Give Preview deployments their own Neon branch when testing schema changes. Do not point untrusted preview branches at production data.
- Changing `AUTH_SECRET` signs out every user.
- Run `npm run check` before pushing.

## Credits

Book metadata: [Google Books API](https://developers.google.com/books) and [Open Library](https://openlibrary.org/developers/api).
