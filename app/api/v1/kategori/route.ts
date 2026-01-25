import { NextRequest, NextResponse } from 'next/server';

const categories = [
  { id: 1, name: 'Wisuda', slug: 'wisuda', icon_name: 'GraduationCap', description: 'Buket untuk wisuda' },
  { id: 2, name: 'Guru', slug: 'guru', icon_name: 'BookOpen', description: 'Hadiah untuk guru' },
  { id: 3, name: 'Ultah', slug: 'ultah', icon_name: 'Gift', description: 'Kado ulang tahun' },
  { id: 4, name: 'Nikahan', slug: 'nikah', icon_name: 'Heart', description: 'Buket pernikahan' },
  { id: 5, name: 'Anniv', slug: 'aniv', icon_name: 'Calendar', description: 'Anniversary' },
  { id: 6, name: 'Kado', slug: 'kado', icon_name: 'ShoppingBag', description: 'Kado spesial' },
];

// GET /api/v1/kategori - List all categories
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/v1/kategori - Create new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Add authentication check
    // TODO: Validate request body
    // TODO: Insert into database
    
    const newCategory = {
      id: categories.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
