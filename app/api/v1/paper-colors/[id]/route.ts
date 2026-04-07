import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// DELETE /api/v1/paper-colors/[id] - Delete paper color (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('paper_colors')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete paper color' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Paper color deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/v1/paper-colors/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete paper color' }, { status: 500 });
  }
}
