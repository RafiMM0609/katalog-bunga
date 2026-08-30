'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { Product } from '@/lib/types';

export interface CartItem {
  key: string; // unique identifier: product.id + '-' + paperColor
  product: Product;
  paperColor: string;
  quantity: number;
  addedAt: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  addToCart: (product: Product, paperColor?: string, quantity?: number) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const LOCAL_STORAGE_KEY = 'kagitacraft_cart_items';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items, isInitialized]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (product: Product, paperColor: string = '-', quantity: number = 1) => {
      const selectedColor = paperColor || '-';
      const itemKey = `${product.id}-${selectedColor}`;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.key === itemKey);
        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        } else {
          return [
            ...prevItems,
            {
              key: itemKey,
              product,
              paperColor: selectedColor,
              quantity,
              addedAt: Date.now(),
            },
          ];
        }
      });

      toast.success(
        (t) => (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">
              ✨ <strong>{product.name}</strong> ditambahkan ke keranjang!
            </span>
          </div>
        ),
        {
          duration: 2500,
          style: {
            borderRadius: '16px',
            background: '#FFF0F5',
            color: '#1F2937',
            border: '1px solid #FBCFE8',
            boxShadow: '0 10px 25px -5px rgba(244, 63, 94, 0.15)',
          },
          icon: '🌸',
        }
      );
    },
    []
  );

  const removeFromCart = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
    toast.error('Item dihapus dari keranjang', {
      duration: 2000,
      style: {
        borderRadius: '16px',
        background: '#FFF',
        border: '1px solid #FEE2E2',
      },
    });
  }, []);

  const updateQuantity = useCallback((key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.key === key) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
