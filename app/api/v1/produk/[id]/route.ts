import { NextRequest, NextResponse } from 'next/server';

// Temporary mock data
const products = [
  {
    id: 1,
    name: "Rosie Pink Elegance",
    category_id: 1,
    category: { id: 1, name: "Wisuda", slug: "wisuda" },
    rating: 4.9,
    sold_count: 120,
    bg_color: "bg-white",
    icon_color: "text-pink-300",
    description: "Buket mawar satin premium dengan nuansa soft pink yang manis. Pilihan sempurna untuk merayakan kelulusan dengan anggun.",
    tags: "Best Seller",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Teacher's Appreciation",
    category_id: 2,
    category: { id: 2, name: "Guru", slug: "guru" },
    rating: 5.0,
    sold_count: 45,
    bg_color: "bg-orange-50",
    icon_color: "text-orange-200",
    description: "Bunga matahari sintetis mini sebagai tanda terima kasih yang tulus untuk pahlawan tanpa tanda jasa.",
    tags: "Favorit Guru",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Sweet 17th Blush",
    category_id: 3,
    category: { id: 3, name: "Ultah", slug: "ultah" },
    rating: 4.8,
    sold_count: 88,
    bg_color: "bg-purple-50",
    icon_color: "text-purple-200",
    description: "Kombinasi warna lilac dan pink muda yang dreamy. Ukuran besar (L) untuk momen spesial sweet seventeen.",
    tags: "Promo",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Eternal White Love",
    category_id: 4,
    category: { id: 4, name: "Nikahan", slug: "nikah" },
    rating: 5.0,
    sold_count: 12,
    bg_color: "bg-gray-50",
    icon_color: "text-gray-300",
    description: "Kemewahan bunga mawar putih bersih yang melambangkan ketulusan. Tahan selamanya, seperti janji suci.",
    tags: "Premium",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Anniversary Bloom Box",
    category_id: 5,
    category: { id: 5, name: "Anniv", slug: "aniv" },
    rating: 4.7,
    sold_count: 230,
    bg_color: "bg-rose-50",
    icon_color: "text-rose-200",
    description: "Bloom box minimalis yang manis untuk diletakkan di meja kerja atau sudut kamar orang tersayang.",
    tags: "Gift Idea",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Single Rose Classic",
    category_id: 6,
    category: { id: 6, name: "Kado", slug: "kado" },
    rating: 4.9,
    sold_count: 500,
    bg_color: "bg-red-50",
    icon_color: "text-red-200",
    description: "Setangkai mawar merah klasik dengan wrapping aesthetic. Simpel namun penuh makna.",
    tags: "Budget",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Graduation Blue Sky",
    category_id: 1,
    category: { id: 1, name: "Wisuda", slug: "wisuda" },
    rating: 4.8,
    sold_count: 65,
    bg_color: "bg-blue-50",
    icon_color: "text-blue-300",
    description: "Nuansa biru langit yang menenangkan. Cocok untuk wisudawan laki-laki atau pecinta warna cool tone.",
    tags: "New",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Rustic Dried Flower",
    category_id: 5,
    category: { id: 5, name: "Anniv", slug: "aniv" },
    rating: 5.0,
    sold_count: 22,
    bg_color: "bg-amber-50",
    icon_color: "text-amber-700",
    description: "Kombinasi bunga kering dan sintetis bernuansa earth tone. Estetik banget untuk dekorasi kamar.",
    tags: "Aesthetic",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// GET /api/v1/produk/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/produk/[id] - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await request.json();
    
    // TODO: Add authentication check
    // TODO: Validate request body
    // TODO: Update in database
    
    const product = products.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = {
      ...product,
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/produk/[id] - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    
    // TODO: Add authentication check
    // TODO: Delete from database
    
    const product = products.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
