import { NextRequest, NextResponse } from 'next/server';

// Temporary mock orders storage
let orders: any[] = [];

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

    const newOrder = {
      id: orders.length + 1,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email || null,
      product_id: body.product_id,
      selected_paper_color: body.selected_paper_color || null,
      customer_rating: body.customer_rating || null,
      notes: body.notes || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    orders.push(newOrder);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET /api/v1/orders - List all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
