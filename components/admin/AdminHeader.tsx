import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface AdminHeaderProps {
  username: string;
}

export default function AdminHeader({ username }: AdminHeaderProps) {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-2 p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden md:inline font-medium text-sm">Kembali ke Beranda</span>
          </Link>

          {/* Center: Title */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold text-pink-900">
              Kagitacraft<span className="text-pink-400">.</span>
            </span>
            <span className="text-xs font-bold bg-pink-600 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              Admin Panel
            </span>
          </div>

          {/* Right: User & Logout */}
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm text-gray-600">
              <span className="font-medium">{username}</span>
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
