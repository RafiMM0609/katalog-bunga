import { notFound } from 'next/navigation';
import { getProductById, getAllProductIds } from '@/lib/data';
import ProductDetailModal from '@/components/modals/ProductDetailModal';

export const revalidate = 60; // Enable ISR with 60-second revalidation

export async function generateStaticParams() {
  const products = await getAllProductIds();
  return products.map((p) => ({
    id: String(p.id),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return { title: 'Produk Tidak Ditemukan - Kagitacraft' };
    }
    
    return {
      title: `${product.name} - Kagitacraft`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        type: 'website',
        ...(product.image_url && {
          images: [{ url: product.image_url, width: 800, height: 1000, alt: product.name }],
        }),
      },
    };
  } catch {
    return {
      title: 'Produk Tidak Ditemukan - Kagitacraft',
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetailModal product={product} />;
}

