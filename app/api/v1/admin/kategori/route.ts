import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// POST - Create new category (admin only)
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        icon_name: body.icon_name || 'Gift',
        description: body.description || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('POST /api/v1/admin/kategori error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
