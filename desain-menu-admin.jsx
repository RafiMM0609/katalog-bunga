import React, { useState, useEffect } from 'react';
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
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  LayoutDashboard,
  Upload,
  MoveUp,
  MoveDown,
  Palette,
  Tags,
  Image as ImageIcon
} from 'lucide-react';

// --- DATA AWAL (Initial State) ---
const initialCategories = [
  { id: 'wisuda', name: 'Wisuda', iconName: 'GraduationCap' },
  { id: 'guru', name: 'Guru', iconName: 'BookOpen' },
  { id: 'ultah', name: 'Ultah', iconName: 'Gift' },
  { id: 'nikah', name: 'Nikahan', iconName: 'Heart' },
  { id: 'aniv', name: 'Anniv', iconName: 'Calendar' },
];

const initialPaperColors = [
  { id: 1, name: 'Pink Pastel', hex: '#FBCFE8' },
  { id: 2, name: 'Cream', hex: '#FDE68A' },
  { id: 3, name: 'Silver', hex: '#E5E7EB' },
  { id: 4, name: 'Putih', hex: '#FFFFFF' },
  { id: 5, name: 'Hitam', hex: '#1F2937' },
  { id: 6, name: 'Lilac', hex: '#E9D5FF' }
];

const initialProducts = [
  {
    id: 1,
    name: "Rosie Pink Elegance",
    category: "wisuda",
    rating: 4.9,
    sold: 120,
    bgColor: "bg-white", 
    image: null, // Field baru untuk gambar
    desc: "Buket mawar satin premium dengan nuansa soft pink yang manis.",
    tags: ["Best Seller"]
  },
  {
    id: 2,
    name: "Teacher's Appreciation",
    category: "guru",
    rating: 5.0,
    sold: 45,
    bgColor: "bg-orange-50",
    image: null,
    desc: "Bunga matahari sintetis mini sebagai tanda terima kasih.",
    tags: ["Favorit Guru"]
  },
  {
    id: 3,
    name: "Sweet 17th Blush",
    category: "ultah",
    rating: 4.8,
    sold: 88,
    bgColor: "bg-purple-50",
    image: null,
    desc: "Kombinasi warna lilac dan pink muda yang dreamy.",
    tags: ["Promo"]
  },
  {
    id: 4,
    name: "Eternal White Love",
    category: "nikah",
    rating: 5.0,
    sold: 12,
    bgColor: "bg-gray-50",
    image: null,
    desc: "Kemewahan bunga mawar putih bersih yang melambangkan ketulusan.",
    tags: ["Premium"]
  }
];

// Helper untuk Icon Mapping (karena kita simpan nama icon string di state category)
const iconMap = {
  ShoppingBag, Heart, Gift, GraduationCap, BookOpen, Calendar, Star, MessageCircle
};

export default function App() {
  const [view, setView] = useState('home'); 
  const [inventory, setInventory] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [paperColors, setPaperColors] = useState(initialPaperColors);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [formMode, setFormMode] = useState('add');

  // Filter Logic
  const filteredProducts = activeCategory === 'all' 
    ? inventory 
    : inventory.filter(p => p.category === activeCategory);

  // --- ACTIONS ---
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView('home');
    setSelectedProduct(null);
  };

  // --- ADMIN ACTIONS ---
  const handleAdminEnter = () => {
    setView('admin');
    window.scrollTo(0, 0);
  };

  // Product CRUD
  const handleDeleteProduct = (id) => {
    if (window.confirm("Hapus produk ini?")) {
      setInventory(inventory.filter(p => p.id !== id));
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormMode('edit');
    setView('admin-product-form');
    window.scrollTo(0, 0);
  };

  const handleAddProduct = () => {
    setSelectedProduct({
      id: null, name: '', category: categories[0]?.id || 'wisuda', 
      rating: 0, sold: 0, bgColor: 'bg-white', image: null, desc: '', tags: []
    });
    setFormMode('add');
    setView('admin-product-form');
    window.scrollTo(0, 0);
  };

  const handleSaveProduct = (productData) => {
    if (formMode === 'edit') {
      setInventory(inventory.map(p => p.id === productData.id ? productData : p));
    } else {
      const newId = inventory.length > 0 ? Math.max(...inventory.map(p => p.id)) + 1 : 1;
      setInventory([...inventory, { ...productData, id: newId }]);
    }
    setView('admin');
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] font-sans text-gray-700 selection:bg-pink-200 flex flex-col">
      
      {/* --- HEADER --- */}
      <nav className="fixed w-full z-50 top-0 left-0 bg-[#FFF0F5]/90 backdrop-blur-md border-b border-pink-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {(view !== 'home') ? (
                <button onClick={() => view.includes('admin') && view !== 'admin' ? setView('admin') : handleBack()} className="p-2 -ml-2 rounded-full hover:bg-pink-100 text-gray-600 transition-colors flex items-center gap-2">
                  <ArrowLeft size={22} />
                  <span className="hidden md:inline font-medium text-sm">Kembali</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <Menu className="md:hidden text-gray-500" size={22} />
                  <span className="font-serif text-2xl font-bold text-pink-900 tracking-wide cursor-pointer" onClick={() => setView('home')}>
                    Kagitacraft<span className="text-pink-400">.</span>
                  </span>
                </div>
              )}
            </div>

            {/* Admin Badge */}
            <div className="flex items-center gap-4">
              {view.includes('admin') ? (
                <span className="text-xs font-bold bg-pink-600 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-pink-200 shadow-lg">Admin Panel</span>
              ) : (
                <div className="relative cursor-pointer group">
                  <ShoppingBag size={22} className="text-gray-500 group-hover:text-pink-600 transition-colors" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="pt-24 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full">
        
        {view === 'home' && (
          <HomeView 
            products={filteredProducts} 
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onProductClick={handleProductClick}
          />
        )}

        {view === 'detail' && (
          <ProductDetailView product={selectedProduct} paperColors={paperColors} />
        )}

        {view === 'admin' && (
          <AdminDashboard 
            products={inventory}
            categories={categories}
            setCategories={setCategories}
            paperColors={paperColors}
            setPaperColors={setPaperColors}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={handleEditProduct}
            onAddProduct={handleAddProduct}
          />
        )}

        {view === 'admin-product-form' && (
          <AdminProductForm 
            product={selectedProduct} 
            categories={categories}
            mode={formMode} 
            onSave={handleSaveProduct} 
            onCancel={() => setView('admin')}
          />
        )}

      </main>
      
      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-pink-100 py-8 text-center text-sm text-gray-400">
         <p className="mb-2">&copy; 2026 Kagitacraft. Made with love.</p>
         {view === 'home' && (
           <button onClick={handleAdminEnter} className="text-[10px] text-gray-300 hover:text-pink-500 transition-colors underline">
             Masuk sebagai Admin
           </button>
         )}
      </footer>
    </div>
  );
}

// --- VIEWS ---

function HomeView({ products, categories, activeCategory, setActiveCategory, onProductClick }) {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-200 to-rose-100 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="relative z-10 max-w-lg text-center md:text-left">
          <span className="inline-block bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-pink-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">New Collection</span>
          <h2 className="font-serif text-3xl md:text-5xl text-gray-800 leading-tight mb-4">Bunga Abadi <br/><span className="italic font-light text-pink-600">Penuh Makna.</span></h2>
          <button className="bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-pink-600 transition-all">Lihat Katalog</button>
        </div>
        <div className="relative md:w-1/3 flex justify-center"><Heart className="text-pink-400 opacity-60 md:scale-150 animate-pulse-slow" size={180} fill="currentColor" /></div>
      </div>

      {/* Categories */}
      <div className="flex flex-col items-center">
        <h3 className="font-serif text-xl text-gray-800 mb-6 text-center">Telusuri Kategori</h3>
        <div className="w-full flex gap-4 overflow-x-auto pb-4 justify-start md:justify-center scrollbar-hide px-2">
          {/* Default 'Semua' Button */}
          <button 
              onClick={() => setActiveCategory('all')}
              className={`flex flex-col items-center gap-3 min-w-[80px] p-2 rounded-xl transition-all ${activeCategory === 'all' ? 'scale-105' : 'opacity-60'}`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${activeCategory === 'all' ? 'bg-pink-400 text-white shadow-lg' : 'bg-white border border-pink-100 text-gray-400'}`}>
              <ShoppingBag size={24} />
            </div>
            <span className={`text-xs font-medium ${activeCategory === 'all' ? 'text-pink-600' : 'text-gray-500'}`}>Semua</span>
          </button>

          {categories.map((cat) => {
            const Icon = iconMap[cat.iconName] || Gift;
            return (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-3 min-w-[80px] p-2 rounded-xl transition-all ${activeCategory === cat.id ? 'scale-105' : 'opacity-60'}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${activeCategory === cat.id ? 'bg-pink-400 text-white shadow-lg' : 'bg-white border border-pink-100 text-gray-400'}`}>
                  <Icon size={24} />
                </div>
                <span className={`text-xs font-medium ${activeCategory === cat.id ? 'text-pink-600' : 'text-gray-500'}`}>{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {products.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onProductClick(item)}
            className="group cursor-pointer bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 hover:-translate-y-1 transition-all border border-transparent hover:border-pink-100"
          >
            <div className={`aspect-[4/5] ${item.bgColor === 'bg-white' ? 'bg-gray-50' : item.bgColor} rounded-xl flex items-center justify-center relative overflow-hidden`}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <Heart className="text-pink-300 opacity-60 group-hover:scale-110 transition-transform duration-700" size={60} fill="currentColor" />
                )}
                
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-semibold text-pink-600 shadow-sm border border-pink-50">{tag}</span>
                  ))}
                </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                  <div className="flex items-center gap-0.5 text-[10px] text-yellow-500 ml-auto">
                    <Star size={10} fill="currentColor" /> {item.rating}
                  </div>
              </div>
              <h4 className="font-serif text-base text-gray-800 leading-tight mb-2 group-hover:text-pink-600 line-clamp-2 min-h-[2.5em]">{item.name}</h4>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                  <span className="text-xs font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-md">Tanya Admin</span>
                  <div className="text-xs text-gray-400">{item.sold}+ terjual</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetailView({ product, paperColors }) {
  const [selectedPaper, setSelectedPaper] = useState(paperColors[0]?.name || '');

  const handleOrder = () => {
    const message = `Halo Admin, saya tertarik dengan *${product.name}*. Warna Kertas: ${selectedPaper}. Mohon info harga?`;
    alert(`Membuka WhatsApp...\n\n${message}`);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto bg-white md:rounded-3xl shadow-xl shadow-pink-100/50 overflow-hidden border border-pink-50 flex flex-col md:flex-row">
       <div className={`w-full md:w-1/2 min-h-[350px] md:min-h-[500px] ${product.bgColor === 'bg-white' ? 'bg-pink-50' : product.bgColor} flex items-center justify-center relative overflow-hidden bg-cover bg-center`}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Heart className="text-pink-300 opacity-60 animate-pulse-slow" size={180} fill="currentColor" />
          )}
       </div>
       <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-[#FFF8F8]">
          <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest w-fit mb-2">{product.category}</span>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-6 leading-tight">{product.name}</h1>
          
          <div className="mb-8">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pilih Warna Kertas</h3>
             <div className="flex flex-wrap gap-3">
                {paperColors.map((item) => (
                   <button 
                       key={item.id} 
                       onClick={() => setSelectedPaper(item.name)}
                       className={`group relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedPaper === item.name ? 'border-pink-500 scale-110 shadow-md' : 'border-gray-200 hover:border-pink-300'}`} 
                       style={{backgroundColor: item.hex}}
                       title={item.name}
                   >
                       {selectedPaper === item.name && <div className={`w-3 h-3 rounded-full ${item.hex.toLowerCase() === '#1f2937' || item.hex.toLowerCase() === '#000000' ? 'bg-white' : 'bg-pink-600'}`}></div>}
                   </button>
                ))}
             </div>
             <p className="text-xs text-pink-500 mt-2 font-medium">Terpilih: {selectedPaper}</p>
          </div>

          <button onClick={handleOrder} className="w-full bg-gray-800 text-white font-medium py-4 rounded-xl shadow-xl hover:bg-pink-600 transition-all flex items-center justify-center gap-3">
             <MessageCircle size={20} /> Cek Harga via WhatsApp
          </button>
       </div>
    </div>
  );
}

// --- ADMIN DASHBOARD (MULTI-TAB) ---

function AdminDashboard({ 
  products, categories, setCategories, paperColors, setPaperColors,
  onDeleteProduct, onEditProduct, onAddProduct 
}) {
  const [activeTab, setActiveTab] = useState('products'); // products | categories | colors

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 md:gap-4 border-b border-pink-200 pb-2">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-t-lg font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'products' ? 'bg-white text-pink-600 border-b-2 border-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <LayoutDashboard size={18}/> Produk
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-t-lg font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'categories' ? 'bg-white text-pink-600 border-b-2 border-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Tags size={18}/> Kategori
        </button>
        <button 
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 rounded-t-lg font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'colors' ? 'bg-white text-pink-600 border-b-2 border-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Palette size={18}/> Warna Kertas
        </button>
      </div>

      {/* CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden p-4 md:p-6">
           <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl font-bold text-gray-800">Daftar Produk</h2>
              <button onClick={onAddProduct} className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-pink-700">
                <Plus size={16} /> Tambah
              </button>
           </div>
           
           <div className="space-y-3">
             {products.map((item) => (
               <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-50 rounded-xl hover:bg-pink-50/30 transition-colors">
                 <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20}/></div>
                    )}
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                   <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => onEditProduct(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit3 size={16}/></button>
                   <button onClick={() => onDeleteProduct(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* CONTENT: CATEGORIES */}
      {activeTab === 'categories' && (
        <AdminCategoryManager categories={categories} setCategories={setCategories} />
      )}

      {/* CONTENT: COLORS */}
      {activeTab === 'colors' && (
        <AdminColorManager colors={paperColors} setColors={setPaperColors} />
      )}

    </div>
  );
}

// --- ADMIN SUB-MANAGERS ---

function AdminCategoryManager({ categories, setCategories }) {
  const [newCatName, setNewCatName] = useState('');

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newId = newCatName.toLowerCase().replace(/\s+/g, '-');
    setCategories([...categories, { id: newId, name: newCatName, iconName: 'Gift' }]);
    setNewCatName('');
  };

  const deleteCategory = (id) => {
    if (window.confirm("Hapus kategori ini?")) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const moveCategory = (index, direction) => {
    const newCats = [...categories];
    if (direction === 'up' && index > 0) {
      [newCats[index], newCats[index - 1]] = [newCats[index - 1], newCats[index]];
    } else if (direction === 'down' && index < newCats.length - 1) {
      [newCats[index], newCats[index + 1]] = [newCats[index + 1], newCats[index]];
    }
    setCategories(newCats);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
      <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">Atur Kategori</h2>
      
      {/* Add Form */}
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          placeholder="Nama Kategori Baru"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-pink-500 outline-none"
        />
        <button onClick={addCategory} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold">Tambah</button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {categories.map((cat, idx) => (
          <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
             <div className="flex items-center gap-3">
               <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-xs font-bold text-pink-600">{idx + 1}</span>
               <span className="font-medium text-gray-700">{cat.name}</span>
               <span className="text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded border">ID: {cat.id}</span>
             </div>
             <div className="flex items-center gap-1">
               <button onClick={() => moveCategory(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"><MoveUp size={16}/></button>
               <button onClick={() => moveCategory(idx, 'down')} disabled={idx === categories.length - 1} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"><MoveDown size={16}/></button>
               <div className="w-px h-4 bg-gray-300 mx-2"></div>
               <button onClick={() => deleteCategory(cat.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminColorManager({ colors, setColors }) {
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });

  const addColor = () => {
    if (!newColor.name.trim()) return;
    const newId = colors.length > 0 ? Math.max(...colors.map(c => c.id)) + 1 : 1;
    setColors([...colors, { ...newColor, id: newId }]);
    setNewColor({ name: '', hex: '#000000' });
  };

  const deleteColor = (id) => {
    setColors(colors.filter(c => c.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
      <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">Atur Warna Kertas</h2>

      {/* Add Form */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <input 
          type="color" 
          value={newColor.hex}
          onChange={(e) => setNewColor({...newColor, hex: e.target.value})}
          className="w-10 h-10 rounded cursor-pointer border-0"
        />
        <input 
          type="text" 
          value={newColor.name}
          onChange={(e) => setNewColor({...newColor, name: e.target.value})}
          placeholder="Nama Warna (misal: Navy Blue)"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-pink-500 outline-none"
        />
        <button onClick={addColor} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold">Tambah</button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {colors.map((col) => (
          <div key={col.id} className="p-3 border border-gray-100 rounded-xl flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: col.hex }}></div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">{col.name}</span>
                <span className="text-[10px] text-gray-400 uppercase">{col.hex}</span>
              </div>
            </div>
            <button onClick={() => deleteColor(col.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminProductForm({ product, categories, mode, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: product?.id || null,
    name: product?.name || '',
    category: product?.category || categories[0]?.id,
    desc: product?.desc || '',
    tags: product?.tags?.join(', ') || '',
    bgColor: product?.bgColor || 'bg-white',
    rating: product?.rating || 5.0,
    sold: product?.sold || 0,
    image: product?.image || null
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t),
    });
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-serif text-xl text-gray-800 font-bold">{mode === 'edit' ? 'Edit Produk' : 'Tambah Produk'}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload Field */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative">
             <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
             {formData.image ? (
               <div className="relative w-32 h-32 mx-auto">
                 <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
                 <p className="text-xs text-gray-400 mt-2">Klik untuk ganti gambar</p>
               </div>
             ) : (
               <div className="flex flex-col items-center gap-2 text-gray-400">
                 <Upload size={32} />
                 <span className="text-sm font-medium">Upload Foto Produk</span>
                 <span className="text-xs">JPG, PNG (Max 2MB)</span>
               </div>
             )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama Produk</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 outline-none" placeholder="Nama Bunga..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kategori</label>
               <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white">
                 {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Warna Background</label>
               <select value={formData.bgColor} onChange={(e) => setFormData({...formData, bgColor: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white">
                  <option value="bg-white">Putih</option>
                  <option value="bg-pink-50">Pink Soft</option>
                  <option value="bg-blue-50">Blue Soft</option>
                  <option value="bg-purple-50">Purple Soft</option>
                  <option value="bg-orange-50">Orange Soft</option>
               </select>
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Deskripsi</label>
             <textarea rows="3" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 outline-none" />
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tags (Pisahkan koma)</label>
             <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none" placeholder="Best Seller, Promo..." />
          </div>

          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">Batal</button>
             <button type="submit" className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-pink-700 flex items-center justify-center gap-2"><Save size={20} /> Simpan</button>
          </div>
        </form>
    </div>
  );
}