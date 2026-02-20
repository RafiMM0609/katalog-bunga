import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

const categories = [
  { id: 1, name: 'Wisuda', slug: 'wisuda', icon_name: 'GraduationCap', description: 'Buket untuk wisuda' },
  { id: 2, name: 'Guru', slug: 'guru', icon_name: 'BookOpen', description: 'Hadiah untuk guru' },
  { id: 3, name: 'Ultah', slug: 'ultah', icon_name: 'Gift', description: 'Kado ulang tahun' },
  { id: 4, name: 'Nikahan', slug: 'nikah', icon_name: 'Heart', description: 'Buket pernikahan' },
  { id: 5, name: 'Anniv', slug: 'aniv', icon_name: 'Calendar', description: 'Anniversary' },
  { id: 6, name: 'Kado', slug: 'kado', icon_name: 'ShoppingBag', description: 'Kado spesial' },
];

// POST - Create new category (admin only)
export async function POST(request: Request) {
  try {
    // Verify admin
    await requireAdmin();

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const newCategory = {
      id: categories.length + 1,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      icon_name: body.icon_name || 'Gift',
      description: body.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    categories.push(newCategory);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
