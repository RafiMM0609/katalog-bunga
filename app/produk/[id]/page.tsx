import { notFound } from 'next/navigation';
import ProductDetailServer from '@/components/product/ProductDetailServer';

async function getProduct(id: string) {
  const res = await fetch(`/api/v1/produk/${id}`, {
    cache: 'no-store', // For dynamic data
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProduct(id);
    
    return {
      title: `${product.name} - Kagitacraft`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Produk Tidak Ditemukan - Kagitacraft',
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  return <ProductDetailServer product={product} />;
}
