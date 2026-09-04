'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { VscGear, VscGraph, VscLibrary, VscOpenPreview } from 'react-icons/vsc';
import { logout } from '@/lib/actions';
import Logo from './Logo';

export default function Header({ user }: { user?: { name?: string | null } }) {
  type Navigation = {
    label: string;
    href: string;
    icon: IconType;
  };

  const navigation: Navigation[] = [
    { label: 'HOME', href: '/', icon: VscLibrary },
    { label: 'SEARCH', href: '/search', icon: VscOpenPreview },
    { label: 'STATS', href: '/stats', icon: VscGraph },
    { label: 'SETTINGS', href: '/settings', icon: VscGear },
  ];

  const path = usePathname();
  const activePath = (href: string) => {
    if (href === '/' && path === href) return true;
    if (href !== '/' && path.includes(href)) return true;
    return false;
  };
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 py-5" aria-label="Site header">
      <Logo />
      <nav className="flex items-center gap-1 rounded-full bg-white/65 p-1 shadow-sm ring-1 ring-ink/5" aria-label="Primary navigation">
        {navigation.map((nav) => (
          <Link
            key={nav.label}
            href={nav.href}
            aria-current={activePath(nav.href) ? 'page' : undefined}
            className={`${activePath(nav.href) ? 'bg-ink text-paper shadow-sm' : 'text-ink-muted hover:bg-white hover:text-ink'} flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition`}
          >
            <span>
              <nav.icon size={19} />
            </span>
            <span className="hidden sm:inline">{nav.label}</span>
          </Link>
        ))}
        {user ? <form action={logout}><button className="rounded-full px-3 py-2 text-sm font-bold text-ink-muted hover:bg-white hover:text-ink">Sign out</button></form> : null}
      </nav>
    </header>
  );
}
