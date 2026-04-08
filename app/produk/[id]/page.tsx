import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductDetailServer from '@/components/product/ProductDetailServer';

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
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
        ...(product.image_url && {
          images: [{ url: product.image_url, width: 800, height: 1000, alt: product.name }],
        }),
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
