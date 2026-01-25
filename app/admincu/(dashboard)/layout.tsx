import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  title: "Admin Dashboard - Kagitacraft",
  description: "Admin panel untuk mengelola produk, kategori, dan pesanan Kagitacraft",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admincu/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={session.username} />
      <main className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
