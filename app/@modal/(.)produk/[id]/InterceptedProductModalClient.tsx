'use client';

import { useRouter } from 'next/navigation';
import ProductDetailModal from '@/components/modals/ProductDetailModal';
import type { Product } from '@/lib/types';

interface InterceptedProductModalClientProps {
  product: Product;
}

export default function InterceptedProductModalClient({ product }: InterceptedProductModalClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return <ProductDetailModal product={product} onClose={handleClose} />;
}
