import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/v1/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.customer_name || !body.customer_phone || !body.product_id) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_name, customer_phone, product_id' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email || null,
        product_id: body.product_id,
        selected_paper_color: body.selected_paper_color || null,
        customer_rating: body.customer_rating || null,
        notes: body.notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/orders error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// GET /api/v1/orders - List all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, product:products(id, name, category:categories(id, name, slug))')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error('GET /api/v1/orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
