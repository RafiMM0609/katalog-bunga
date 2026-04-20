import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET /api/v1/admin/produk - List ALL products (including inactive) for admin panel
export async function GET() {
  try {
    await requireAdmin();

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error('GET /api/v1/admin/produk error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
