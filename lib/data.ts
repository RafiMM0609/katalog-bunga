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
  perPage: number = 12
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
