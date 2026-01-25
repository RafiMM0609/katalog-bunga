'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
      <Link 
        href="/" 
        className={`hover:text-pink-600 transition-colors ${pathname === '/' ? 'text-pink-600' : ''}`}
      >
        Beranda
      </Link>
      <Link 
        href="/katalog" 
        className={`hover:text-pink-600 transition-colors ${pathname === '/katalog' ? 'text-pink-600' : ''}`}
      >
        Katalog
      </Link>
      <Link 
        href="/tentang-kami" 
        className={`hover:text-pink-600 transition-colors ${pathname === '/tentang-kami' ? 'text-pink-600' : ''}`}
      >
        Tentang Kami
      </Link>
    </div>
  );
}
