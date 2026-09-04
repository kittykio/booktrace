import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { auth } from '@/auth';

export const metadata = {
  metadataBase: new URL('https://kiki-booktrace.vercel.app'),
  applicationName: 'Booktrace',
  title: { default: 'Booktrace', template: '%s · Booktrace' },
  description: 'Keep a personal history of the books you read, with reviews, ratings, notes, and reading goals.',
  keywords: ['reading tracker', 'book reviews', 'reading journal', 'personal library'],
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: 'Booktrace',
    description: 'Keep a personal history of the books you read, with reviews, ratings, notes, and reading goals.',
    url: '/',
    siteName: 'Booktrace',
    type: 'website',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen text-ink"
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:text-black focus:p-3">Skip to content</a>
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-8">
        <Header user={session?.user} />
        <main id="main" className="flex-grow" tabIndex={-1}>{children}</main>
        <Footer />
        </div>
      </body>
    </html>
  );
}
