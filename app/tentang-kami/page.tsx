export default function TentangKamiPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-8 md:p-12">
        <h1 className="font-serif text-4xl text-gray-800 mb-6">Tentang Kami</h1>
        
        <div className="prose prose-pink max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Selamat datang di <strong className="text-pink-600">Kagitacraft</strong> - tempat di mana setiap bunga menyimpan cerita yang tak akan pernah layu.
          </p>

          <h2 className="font-serif text-2xl text-gray-800 mt-8 mb-4">Kisah Kami</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Kagitacraft lahir dari keinginan untuk menciptakan hadiah yang bermakna dan tahan lama. 
            Kami percaya bahwa setiap momen spesial layak untuk dikenang dengan cara yang indah dan 
            berkelanjutan.
          </p>

          <h2 className="font-serif text-2xl text-gray-800 mt-8 mb-4">Mengapa Memilih Kami?</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-pink-500 font-bold">✓</span>
              <span><strong>Bunga Abadi:</strong> Tidak akan layu, dapat disimpan selamanya sebagai kenangan</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-500 font-bold">✓</span>
              <span><strong>Desain Custom:</strong> Sesuaikan dengan tema dan warna favoritmu</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-500 font-bold">✓</span>
              <span><strong>Kualitas Premium:</strong> Menggunakan bahan berkualitas tinggi</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-500 font-bold">✓</span>
              <span><strong>Ramah Lingkungan:</strong> Alternatif sustainable untuk bunga segar</span>
            </li>
          </ul>

          <h2 className="font-serif text-2xl text-gray-800 mt-8 mb-4">Produk Kami</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Kami menyediakan berbagai pilihan buket untuk berbagai momen spesial:
          </p>
          <ul className="grid md:grid-cols-2 gap-3 text-gray-600 mb-6">
            <li className="flex items-center gap-2">
              <span className="text-pink-400">🎓</span> Wisuda
            </li>
            <li className="flex items-center gap-2">
              <span className="text-pink-400">📚</span> Hadiah Guru
            </li>
            <li className="flex items-center gap-2">
              <span className="text-pink-400">🎂</span> Ulang Tahun
            </li>
            <li className="flex items-center gap-2">
              <span className="text-pink-400">💒</span> Pernikahan
            </li>
            <li className="flex items-center gap-2">
              <span className="text-pink-400">💝</span> Anniversary
            </li>
            <li className="flex items-center gap-2">
              <span className="text-pink-400">🎁</span> Kado Spesial
            </li>
          </ul>

          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 mt-8">
            <h3 className="font-serif text-xl text-gray-800 mb-3">Hubungi Kami</h3>
            <p className="text-gray-600 mb-4">
              Punya pertanyaan atau ingin order custom? Kami siap membantu!
            </p>
            <a 
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER || '6281234567890'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-pink-600 transition-all"
            >
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
