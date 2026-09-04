# Booktrace: from CRUD prototype to reading product

## The problem

The original app proved a sound full-stack foundation—search, pagination, PostgreSQL persistence, editing, and deletion—but treated every visitor as one shared user and every saved book as an undifferentiated note. The redesign asks a product question: what helps a reader understand and sustain their reading life?

## Product decisions

The library is private by default. Each user owns independent entries and goals. A book can move through `want to read`, `reading`, `read`, `paused`, and `did not finish`; these states model real behavior without forcing a success-only funnel. Ratings, favorites, tags, dates, and notes remain optional so saving a book is lightweight.

The dashboard favors motivating measures over vanity analytics: books finished this year, current reads, favorites, average rating, and annual-goal completion. The initial goal defaults to 12 but is editable.

## Technical design

The App Router keeps reads on the server and uses server actions for mutations. Auth.js issues signed JWT sessions. Credentials are normalized before lookup, passwords are bcrypt-hashed, and every private data operation derives ownership from the server session rather than client input.

Prisma expresses ownership with cascading foreign keys and compound uniqueness on `(userId, bookId)` and `(userId, year)`. Indexes support the common status and favorite filters. Google Books supplies discovery metadata; saved entries retain a snapshot to avoid making the library dependent on upstream availability.

Zod is the boundary between browser input and the domain. It limits lengths and ranges, normalizes email and tags, removes duplicate tags, and converts date/rating inputs into typed values. Expected mutation failures return inline messages; unexpected route failures provide a retry path.

## Accessibility and resilience

The interface includes a skip link, semantic navigation and headings, visible focus rings, descriptive cover alt text, explicit labels, live form status, accessible goal progress, reduced-motion handling, and touch-friendly controls. Skeletons reserve space while routes load; dedicated empty and failure states always offer a useful next action.

## Verification strategy

Fast unit tests cover validation rules and defensive Google Books mapping. Type checking catches server/client contract drift, ESLint covers framework and accessibility conventions, and the production build validates App Router composition. The next testing layer should add Playwright flows for registration, library isolation, editing, and goal completion against an ephemeral PostgreSQL database.

## Tradeoffs and next steps

JWT sessions keep infrastructure small but make immediate global session revocation harder than database sessions. Credential auth is suitable for this portfolio product; production growth should add verified email, password reset, rate limiting, and optionally passkeys or OAuth. Other useful increments are ISBN deduplication, imports/exports, richer monthly trends, optimistic favorite toggles, and background metadata refreshes.
