export default function KatalogPage() {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl text-gray-800 mb-3">Katalog Lengkap</h1>
        <p className="text-gray-500">Jelajahi semua koleksi bunga kami</p>
      </div>

      {/* Content will be added later - similar to home page but with more filters */}
      <div className="text-center py-20 bg-white rounded-3xl border border-pink-100">
        <p className="text-gray-400">Katalog lengkap akan segera hadir...</p>
        <p className="text-sm text-gray-400 mt-2">Sementara Anda bisa melihat produk di halaman utama</p>
        <a 
          href="/" 
          className="inline-block mt-6 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
