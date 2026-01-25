import ProductCard from "@/components/ui/ProductCard";

// Temporary mock data - will be replaced with API call
const products = [
  {
    id: 1,
    name: "Rosie Pink Elegance",
    category: "wisuda",
    rating: 4.9,
    sold_count: 120,
    bg_color: "bg-white",
    icon_color: "text-pink-300",
    description: "Buket mawar satin premium dengan nuansa soft pink yang manis. Pilihan sempurna untuk merayakan kelulusan dengan anggun.",
    tags: "Best Seller"
  },
  {
    id: 2,
    name: "Teacher's Appreciation",
    category: "guru",
    rating: 5.0,
    sold_count: 45,
    bg_color: "bg-orange-50",
    icon_color: "text-orange-200",
    description: "Bunga matahari sintetis mini sebagai tanda terima kasih yang tulus untuk pahlawan tanpa tanda jasa.",
    tags: "Favorit Guru"
  },
  {
    id: 3,
    name: "Sweet 17th Blush",
    category: "ultah",
    rating: 4.8,
    sold_count: 88,
    bg_color: "bg-purple-50",
    icon_color: "text-purple-200",
    description: "Kombinasi warna lilac dan pink muda yang dreamy. Ukuran besar (L) untuk momen spesial sweet seventeen.",
    tags: "Promo"
  },
  {
    id: 4,
    name: "Eternal White Love",
    category: "nikah",
    rating: 5.0,
    sold_count: 12,
    bg_color: "bg-gray-50",
    icon_color: "text-gray-300",
    description: "Kemewahan bunga mawar putih bersih yang melambangkan ketulusan. Tahan selamanya, seperti janji suci.",
    tags: "Premium"
  },
  {
    id: 5,
    name: "Anniversary Bloom Box",
    category: "aniv",
    rating: 4.7,
    sold_count: 230,
    bg_color: "bg-rose-50",
    icon_color: "text-rose-200",
    description: "Bloom box minimalis yang manis untuk diletakkan di meja kerja atau sudut kamar orang tersayang.",
    tags: "Gift Idea"
  },
  {
    id: 6,
    name: "Single Rose Classic",
    category: "kado",
    rating: 4.9,
    sold_count: 500,
    bg_color: "bg-red-50",
    icon_color: "text-red-200",
    description: "Setangkai mawar merah klasik dengan wrapping aesthetic. Simpel namun penuh makna.",
    tags: "Budget"
  },
  {
    id: 7,
    name: "Graduation Blue Sky",
    category: "wisuda",
    rating: 4.8,
    sold_count: 65,
    bg_color: "bg-blue-50",
    icon_color: "text-blue-300",
    description: "Nuansa biru langit yang menenangkan. Cocok untuk wisudawan laki-laki atau pecinta warna cool tone.",
    tags: "New"
  },
  {
    id: 8,
    name: "Rustic Dried Flower",
    category: "aniv",
    rating: 5.0,
    sold_count: 22,
    bg_color: "bg-amber-50",
    icon_color: "text-amber-700",
    description: "Kombinasi bunga kering dan sintetis bernuansa earth tone. Estetik banget untuk dekorasi kamar.",
    tags: "Aesthetic"
  }
];

export default function ProductGrid() {
  return (
    <div>
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h3 className="font-serif text-2xl text-gray-800">Katalog Pilihan</h3>
          <p className="text-xs text-gray-400 mt-1">
            Menampilkan {products.length} produk
          </p>
        </div>
      </div>

      {/* Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
