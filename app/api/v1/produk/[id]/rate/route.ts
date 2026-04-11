import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/v1/produk/[id]/rate - Submit a user rating for a product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const rating = Number(body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    // Insert the individual rating record
    const { error: insertError } = await supabase
      .from('product_ratings')
      .insert({ product_id: Number(id), rating });

    if (insertError) throw insertError;

    // Recalculate the average rating from all submitted ratings
    const { data: avgData, error: avgError } = await supabase
      .from('product_ratings')
      .select('rating')
      .eq('product_id', Number(id));

    if (avgError) throw avgError;

    const ratings = (avgData ?? []).map((r: { rating: number }) => r.rating);
    if (ratings.length === 0) {
      return NextResponse.json({ average: rating }, { status: 201 });
    }
    const average = ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;
    const rounded = Math.round(average * 10) / 10;

    // Update the product's rating field
    const { error: updateError } = await supabase
      .from('products')
      .update({ rating: rounded })
      .eq('id', Number(id));

    if (updateError) throw updateError;

    return NextResponse.json({ average: rounded }, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/produk/[id]/rate error:', error);
    return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 });
  }
}
