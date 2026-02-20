'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
      <Link
        href="/"
        className={`neumorphic-btn hover:text-pink-600 ${pathname === '/' ? 'neumorphic-active' : ''}`}
      >
        Beranda
      </Link>
      <Link
        href="/katalog"
        className={`neumorphic-btn hover:text-pink-600 ${pathname === '/katalog' ? 'neumorphic-active' : ''}`}
      >
        Katalog
      </Link>
      <Link
        href="/tentang-kami"
        className={`neumorphic-btn hover:text-pink-600 ${pathname === '/tentang-kami' ? 'neumorphic-active' : ''}`}
      >
        Tentang Kami
      </Link>
    </div>
  );
}
