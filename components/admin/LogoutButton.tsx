'use client'

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Logout berhasil');
        router.push('/');
        router.refresh();
      } else {
        toast.error('Logout gagal');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      <LogOut size={18} />
      <span className="hidden md:inline">Keluar</span>
    </button>
  );
}
