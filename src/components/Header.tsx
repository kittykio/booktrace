'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { VscLibrary, VscOpenPreview } from 'react-icons/vsc';

export default function Header() {
  type Navigation = {
    label: string;
    href: string;
    icon: IconType;
  };

  const navigation: Navigation[] = [
    { label: 'HOME', href: '/', icon: VscLibrary },
    { label: 'SEARCH', href: '/search', icon: VscOpenPreview },
  ];

  const path = usePathname();
  const activePath = (href: string) => {
    if (href === '/' && path === href) return true;
    if (href !== '/' && path.includes(href)) return true;
    return false;
  };
  return (
    <div className="text-lg sm:text-2xl tracking-widest flex justify-between items-center pb-4 flex-wrap gap-2">
      <Link href="/" className="font-notable text-nowrap">
        Book Log
      </Link>
      <div className="flex gap-6 items-center">
        {navigation.map((nav) => (
          <Link
            key={nav.label}
            href={nav.href}
            className={`${
              activePath(nav.href) ? 'border-b-2 border-secondary-100 pb-1' : ''
            } flex flex-nowrap gap-2`}
          >
            <span>
              <nav.icon size={28} />
            </span>
            <span>{nav.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
