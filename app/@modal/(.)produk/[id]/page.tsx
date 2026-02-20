'use client'

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductDetailModal from '@/components/modals/ProductDetailModal';

export default function InterceptedProductModal() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = params.id as string;
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
        const res = await fetch(`${baseUrl}/produk/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    handleClose();
    return null;
  }

  return <ProductDetailModal product={product} onClose={handleClose} />;
}
