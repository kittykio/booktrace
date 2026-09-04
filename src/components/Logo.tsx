import Link from 'next/link';

export default function Logo() {
  return <Link href="/" className="group flex items-center gap-3" aria-label="Booktrace home">
    <svg className="h-10 w-10" viewBox="0 0 48 48" role="img" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#482d20" />
      <path d="M11 14.5c5.3 0 9.6 1.5 13 4.4v18.2c-3.4-2.9-7.7-4.4-13-4.4V14.5Z" fill="#fff7e9" />
      <path d="M37 14.5c-5.3 0-9.6 1.5-13 4.4v18.2c3.4-2.9 7.7-4.4 13-4.4V14.5Z" fill="#fff7e9" />
      <path d="M24 18.9v18.2" stroke="#c88350" strokeWidth="2.5" />
    </svg>
    <span><span className="block text-xl font-black leading-none tracking-tight">Booktrace</span><span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[.24em] text-ink-muted sm:block">Your reading trail</span></span>
  </Link>;
}
