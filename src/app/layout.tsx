import './globals.css';
import { Notable, Sen } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const notable = Notable({ weight: '400', subsets: ['latin'], variable: '--font-notable' });
const sen = Sen({ weight: '400', subsets: ['latin'] });

export const metadata = {
  title: 'Book Log',
  description:
    'An app for bookaholics to keep track of the books you have read and also take notes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${sen.className} ${notable.variable} flex flex-col w-full min-h-screen max-h-[100%] max-w-[100%] p-2 sm:w-[65%] sm:mx-auto text-white caret-transparent`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
