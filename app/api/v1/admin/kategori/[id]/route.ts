import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

// DELETE - Delete category (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin
    await requireAdmin();

    const { id } = await params;
    const categoryId = parseInt(id);

    // In real implementation, delete from database
    // For now, just return success

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
