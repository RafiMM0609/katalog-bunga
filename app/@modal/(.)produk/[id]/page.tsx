import { notFound } from 'next/navigation';
import { getProductById, getAllProductIds } from '@/lib/data';
import InterceptedProductModalClient from './InterceptedProductModalClient';

export const revalidate = 60; // Enable ISR for modal route

export async function generateStaticParams() {
  const products = await getAllProductIds();
  return products.map((p) => ({
    id: String(p.id),
  }));
}

export default async function InterceptedProductModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <InterceptedProductModalClient product={product} />;
}
