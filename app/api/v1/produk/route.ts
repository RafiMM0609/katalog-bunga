import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { paginationConfig } from '@/lib/config';

// GET /api/v1/produk - List all products with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || String(paginationConfig.defaultPage));
    const per_page = parseInt(searchParams.get('per_page') || String(paginationConfig.defaultPerPage));

    let query = supabase
      .from('products')
      .select('*, category:categories(*)', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const from = (page - 1) * per_page;
    const to = from + per_page - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const total = count ?? 0;
    const total_pages = Math.ceil(total / per_page);

    return NextResponse.json({ total, page, per_page, total_pages, data: data ?? [] });
  } catch (error) {
    console.error('GET /api/v1/produk error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/v1/produk - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: body.name,
        category_id: body.category_id,
        description: body.description,
        rating: body.rating ?? 5.0,
        sold_count: body.sold_count ?? 0,
        bg_color: body.bg_color ?? 'bg-white',
        icon_color: body.icon_color ?? 'text-pink-300',
        tags: body.tags || null,
        image_url: body.image_url || null,
        is_active: body.is_active ?? true,
      })
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/produk error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
