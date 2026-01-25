import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Gift, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ArrowLeft, 
  MessageCircle, 
  Star, 
  Menu,
  MessageSquare,
  Search,
  Instagram
} from 'lucide-react';

// --- DATA PRODUK ---
const categories = [
  { id: 'all', name: 'Semua', icon: ShoppingBag },
  { id: 'wisuda', name: 'Wisuda', icon: GraduationCap },
  { id: 'guru', name: 'Guru', icon: BookOpen },
  { id: 'ultah', name: 'Ultah', icon: Gift },
  { id: 'nikah', name: 'Nikahan', icon: Heart },
  { id: 'aniv', name: 'Anniv', icon: Calendar },
];

const products = [
  {
    id: 1,
    name: "Rosie Pink Elegance",
    category: "wisuda",
    rating: 4.9,
    sold: 120,
    bgColor: "bg-white", 
    iconColor: "text-pink-300",
    desc: "Buket mawar satin premium dengan nuansa soft pink yang manis. Pilihan sempurna untuk merayakan kelulusan dengan anggun.",
    tags: ["Best Seller"]
  },
  {
    id: 2,
    name: "Teacher's Appreciation",
    category: "guru",
    rating: 5.0,
    sold: 45,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-200",
    desc: "Bunga matahari sintetis mini sebagai tanda terima kasih yang tulus untuk pahlawan tanpa tanda jasa.",
    tags: ["Favorit Guru"]
  },
  {
    id: 3,
    name: "Sweet 17th Blush",
    category: "ultah",
    rating: 4.8,
    sold: 88,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-200",
    desc: "Kombinasi warna lilac dan pink muda yang dreamy. Ukuran besar (L) untuk momen spesial sweet seventeen.",
    tags: ["Promo"]
  },
  {
    id: 4,
    name: "Eternal White Love",
    category: "nikah",
    rating: 5.0,
    sold: 12,
    bgColor: "bg-gray-50",
    iconColor: "text-gray-300",
    desc: "Kemewahan bunga mawar putih bersih yang melambangkan ketulusan. Tahan selamanya, seperti janji suci.",
    tags: ["Premium"]
  },
  {
    id: 5,
    name: "Anniversary Bloom Box",
    category: "aniv",
    rating: 4.7,
    sold: 230,
    bgColor: "bg-rose-50",
    iconColor: "text-rose-200",
    desc: "Bloom box minimalis yang manis untuk diletakkan di meja kerja atau sudut kamar orang tersayang.",
    tags: ["Gift Idea"]
  },
  {
    id: 6,
    name: "Single Rose Classic",
    category: "kado",
    rating: 4.9,
    sold: 500,
    bgColor: "bg-red-50",
    iconColor: "text-red-200",
    desc: "Setangkai mawar merah klasik dengan wrapping aesthetic. Simpel namun penuh makna.",
    tags: ["Budget"]
  },
   {
    id: 7,
    name: "Graduation Blue Sky",
    category: "wisuda",
    rating: 4.8,
    sold: 65,
    bgColor: "bg-blue-50", 
    iconColor: "text-blue-300",
    desc: "Nuansa biru langit yang menenangkan. Cocok untuk wisudawan laki-laki atau pecinta warna cool tone.",
    tags: ["New"]
  },
  {
    id: 8,
    name: "Rustic Dried Flower",
    category: "aniv",
    rating: 5.0,
    sold: 22,
    bgColor: "bg-amber-50", 
    iconColor: "text-amber-700",
    desc: "Kombinasi bunga kering dan sintetis bernuansa earth tone. Estetik banget untuk dekorasi kamar.",
    tags: ["Aesthetic"]
  }
];

export default function App() {
  const [view, setView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView('home');
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] font-sans text-gray-700 selection:bg-pink-200">
      
      {/* --- RESPONSIVE HEADER --- */}
      <nav className="fixed w-full z-50 top-0 left-0 bg-[#FFF0F5]/80 backdrop-blur-md border-b border-pink-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Menu/Back */}
            <div className="flex items-center">
              {view === 'detail' ? (
                <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-pink-100 text-gray-600 transition-colors flex items-center gap-2">
                  <ArrowLeft size={22} />
                  <span className="hidden md:inline font-medium text-sm">Kembali</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button className="md:hidden p-2 -ml-2 text-gray-500">
                    <Menu size={22} />
                  </button>
                  {/* Logo Brand */}
                  <span className="font-serif text-2xl font-bold text-pink-900 tracking-wide cursor-pointer" onClick={() => setView('home')}>
                    Kagitacraft<span className="text-pink-400">.</span>
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
              <button onClick={() => setView('home')} className={`hover:text-pink-600 transition-colors ${view === 'home' ? 'text-pink-600' : ''}`}>Beranda</button>
              <button className="hover:text-pink-600 transition-colors">Katalog</button>
              <button className="hover:text-pink-600 transition-colors">Tentang Kami</button>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-pink-600 transition-colors md:hidden">
                <Search size={22} />
              </button>
              <div className="relative cursor-pointer group">
                <ShoppingBag size={22} className="text-gray-500 group-hover:text-pink-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <main className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        
        {view === 'home' ? (
          <div className="space-y-10 animate-fade-in">
            
            {/* HERO SECTION (Responsive) */}
            <div className="bg-gradient-to-br from-pink-200 to-rose-100 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center md:justify-between gap-6">
              <div className="relative z-10 max-w-lg text-center md:text-left">
                <span className="inline-block bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-pink-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
                  New Collection 2026
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-gray-800 leading-tight mb-4">
                  Bunga Abadi <br/>
                  <span className="italic font-light text-pink-600">Penuh Makna.</span>
                </h2>
                <p className="text-gray-600 mb-6 text-sm md:text-base max-w-sm mx-auto md:mx-0">
                  Temukan hadiah spesial yang tak akan pernah layu untuk momen terbaikmu.
                </p>
                <button className="bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-200 transition-all transform hover:-translate-y-1">
                  Lihat Katalog
                </button>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative md:w-1/3 flex justify-center">
                 <Heart className="text-pink-400 opacity-60 md:scale-150 animate-pulse-slow" size={180} fill="currentColor" />
              </div>
            </div>

            {/* CATEGORIES (Responsive Scroll & Grid) */}
            <div className="flex flex-col items-center">
              <h3 className="font-serif text-xl text-gray-800 mb-6 md:mb-8 text-center">Telusuri Kategori</h3>
              
              {/* Mobile: Horizontal Scroll, Desktop: Centered Flex */}
              <div className="w-full flex gap-4 overflow-x-auto pb-4 md:pb-0 md:overflow-visible justify-start md:justify-center scrollbar-hide px-2">
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col items-center gap-3 min-w-[80px] group transition-all duration-300 p-2 rounded-xl hover:bg-white hover:shadow-sm ${activeCategory === cat.id ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${activeCategory === cat.id ? 'bg-pink-400 text-white shadow-lg shadow-pink-200' : 'bg-white border border-pink-100 text-gray-400 group-hover:bg-pink-50'}`}>
                      <cat.icon size={24} strokeWidth={1.5} />
                    </div>
                    <span className={`text-xs md:text-sm font-medium ${activeCategory === cat.id ? 'text-pink-600' : 'text-gray-500'}`}>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT GRID (Responsive Columns) */}
            <div>
               <div className="flex justify-between items-end mb-6 px-2">
                  <div>
                    <h3 className="font-serif text-2xl text-gray-800">Katalog Pilihan</h3>
                    <p className="text-xs text-gray-400 mt-1">Menampilkan {filteredProducts.length} produk</p>
                  </div>
               </div>
               
               {/* Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {filteredProducts.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleProductClick(item)}
                    className="group cursor-pointer bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-pink-100"
                  >
                    {/* Image Area */}
                    <div className={`aspect-[4/5] ${item.bgColor === 'bg-white' ? 'bg-gray-50' : item.bgColor} rounded-xl flex items-center justify-center relative overflow-hidden transition-all`}>
                       <Heart className={`${item.iconColor} opacity-60 group-hover:scale-110 transition-transform duration-700`} size={60} strokeWidth={1} fill="currentColor" />
                       
                       {/* Floating Tags */}
                       <div className="absolute top-3 left-3 flex flex-col gap-1">
                         {item.tags.map((tag, idx) => (
                            <span key={idx} className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-semibold text-pink-600 shadow-sm border border-pink-50">
                              {tag}
                            </span>
                         ))}
                       </div>
                    </div>
                    
                    {/* Info Area */}
                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-1">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                         <span className="text-gray-300">•</span>
                         <div className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                            <Star size={10} fill="currentColor" /> {item.rating}
                         </div>
                      </div>
                      <h4 className="font-serif text-base md:text-lg text-gray-800 leading-tight mb-2 group-hover:text-pink-600 transition-colors line-clamp-2 min-h-[2.5em]">{item.name}</h4>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                         <span className="text-xs font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-md group-hover:bg-pink-500 group-hover:text-white transition-colors">Tanya Admin</span>
                         <div className="text-xs text-gray-400">{item.sold}+ terjual</div>
                      </div>
                    </div>
                  </div>
                ))}
               </div>
            </div>

          </div>
        ) : (
          <ProductDetailView product={selectedProduct} onBack={handleBack} />
        )}

      </main>
      
      {/* Footer Simple */}
      <footer className="bg-white border-t border-pink-100 py-8 text-center text-sm text-gray-400">
         <p>&copy; 2026 Kagitacraft. Made with love.</p>
      </footer>
    </div>
  );
}

// --- DETAIL VIEW COMPONENT (Responsive) ---
function ProductDetailView({ product, onBack }) {
  const [paperColor, setPaperColor] = useState('Pink Pastel');
  const [userRating, setUserRating] = useState(0);

  const handleRating = (rate) => setUserRating(rate);

  const handleOrder = () => {
    const message = `Halo Admin Kagitacraft, saya tertarik dengan produk *${product.name}*.\n\nDetail Pilihan:\n- Warna Kertas: ${paperColor}\n\nBoleh tolong info harga dan ongkirnya? Terima kasih.`;
    alert(`Membuka WhatsApp...\n\nPesan:\n${message}`);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
       
       <div className="bg-white md:rounded-3xl shadow-xl shadow-pink-100/50 overflow-hidden border border-pink-50 flex flex-col md:flex-row">
          
          {/* LEFT: IMAGE SECTION (Full Width on Mobile, Half on Desktop) */}
          <div className={`w-full md:w-1/2 min-h-[350px] md:min-h-[500px] ${product.bgColor === 'bg-white' ? 'bg-pink-50' : product.bgColor} flex items-center justify-center relative overflow-hidden`}>
             <div className="absolute inset-0 bg-white/10"></div>
             <Heart className={`${product.iconColor} opacity-60 animate-pulse-slow`} size={180} fill="currentColor" />
             
             {/* Decorative Blobs */}
             <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
             <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
          </div>

          {/* RIGHT: INFO SECTION */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-[#FFF8F8]">
             
             {/* Breadcrumb / Meta */}
             <div className="flex items-center gap-2 mb-4">
                <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold">{product.rating}</span>
                </div>
                <span className="text-xs text-gray-400">• {product.sold} terjual</span>
             </div>

             <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-6 leading-tight">{product.name}</h1>

             {/* Info Box */}
             <div className="bg-white border border-pink-100 rounded-xl p-4 flex items-start gap-4 mb-8 shadow-sm">
                <div className="bg-pink-50 p-2 rounded-full text-pink-500">
                   <MessageSquare size={20} />
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-700">Harga Spesial (By Request)</p>
                   <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                     Harga menyesuaikan dengan kustomisasi. Hubungi kami untuk penawaran terbaik.
                   </p>
                </div>
             </div>

             {/* Description */}
             <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Keterangan Produk</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light">
                   {product.desc}
                </p>
             </div>

             {/* Customization */}
             <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pilih Warna Kertas</h3>
                <div className="flex flex-wrap gap-3">
                   {[
                      {name: 'Pink Pastel', hex: '#FBCFE8'}, 
                      {name: 'Cream', hex: '#FDE68A'}, 
                      {name: 'Silver', hex: '#E5E7EB'},
                      {name: 'Putih', hex: '#FFFFFF'},
                      {name: 'Hitam', hex: '#1F2937'}
                   ].map((item) => (
                      <button 
                          key={item.name} 
                          onClick={() => setPaperColor(item.name)}
                          className={`group relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all flex items-center justify-center ${paperColor === item.name ? 'border-pink-500 scale-110 shadow-md' : 'border-gray-200 hover:border-pink-300'}`} 
                          style={{backgroundColor: item.hex}}
                          title={item.name}
                      >
                          {paperColor === item.name && <div className={`w-3 h-3 rounded-full ${item.name === 'Hitam' ? 'bg-white' : 'bg-pink-500'}`}></div>}
                          <span className="absolute -bottom-6 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.name}</span>
                      </button>
                   ))}
                </div>
             </div>

             {/* Rating Interaction */}
             <div className="mb-8 pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center md:text-left">Berikan Penilaian</h3>
                <div className="flex justify-center md:justify-start gap-2">
                   {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => handleRating(star)}
                        className="transition-transform active:scale-90 hover:scale-110 focus:outline-none"
                      >
                         <Star 
                            size={32} 
                            fill={star <= userRating ? "#FBBF24" : "none"} 
                            className={star <= userRating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}
                         />
                      </button>
                   ))}
                </div>
                {userRating > 0 && <p className="text-xs text-green-500 mt-2 font-medium animate-pulse text-center md:text-left">Terima kasih atas penilaian Anda!</p>}
             </div>

             {/* Action Button */}
             <button 
                onClick={handleOrder}
                className="w-full bg-gray-800 text-white font-medium py-4 rounded-xl shadow-xl shadow-gray-200 hover:bg-pink-600 hover:shadow-pink-200 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1"
             >
                <MessageCircle size={20} />
                <span>Cek Harga & Pesan via WhatsApp</span>
             </button>
          </div>
       </div>
    </div>
  );
}