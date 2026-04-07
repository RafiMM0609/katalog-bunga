import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/v1/paper-colors - List all paper colors
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('product_id');

    let query = supabase
      .from('paper_colors')
      .select('*')
      .order('name', { ascending: true });

    if (productId) {
      query = query.or(`product_id.eq.${productId},product_id.is.null`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error('GET /api/v1/paper-colors error:', error);
    return NextResponse.json({ error: 'Failed to fetch paper colors' }, { status: 500 });
  }
}

// POST /api/v1/paper-colors - Create new paper color (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.hex_code) {
      return NextResponse.json(
        { error: 'name and hex_code are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('paper_colors')
      .insert({
        name: body.name,
        hex_code: body.hex_code,
        product_id: body.product_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/paper-colors error:', error);
    return NextResponse.json({ error: 'Failed to create paper color' }, { status: 500 });
  }
}
