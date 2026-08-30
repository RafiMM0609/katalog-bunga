import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Product, PaginatedResponse } from '@/lib/types';
import { paginationConfig } from '@/lib/config';

export async function getCategories(): Promise<Category[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('getCategories error:', error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error('getCategories exception:', err);
    return [];
  }
}

export async function getProducts(
  categorySlug?: string,
  page: number = 1,
  perPage: number = 12,
  searchQuery?: string
): Promise<PaginatedResponse<Product>> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { total: 0, page, per_page: perPage, total_pages: 1, data: [] };
    }

    let query = supabase
      .from('products')
      .select('*, category:categories(*)', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (searchQuery && searchQuery.trim() !== '') {
      query = query.ilike('name', `%${searchQuery.trim()}%`);
    }

    if (categorySlug && categorySlug !== 'all') {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('getProducts error:', error);
      return { total: 0, page, per_page: perPage, total_pages: 1, data: [] };
    }

    const total = count ?? (data?.length || 0);
    const total_pages = Math.max(1, Math.ceil(total / perPage));

    return { total, page, per_page: perPage, total_pages, data: data ?? [] };
  } catch (err) {
    console.error('getProducts exception:', err);
    return { total: 0, page, per_page: perPage, total_pages: 1, data: [] };
  }
}

export const getProductById = cache(async (id: string): Promise<Product | null> => {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }
    return data as Product;
  } catch (err) {
    console.error('getProductById exception:', err);
    return null;
  }
});

export const getAllProductIds = cache(async (): Promise<{ id: number | string }[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('is_active', true);

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error('getAllProductIds exception:', err);
    return [];
  }
});
