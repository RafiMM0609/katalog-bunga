import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { uploadConfig, supabaseConfig } from '@/lib/config';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!uploadConfig.allowedMimeTypes.includes(file.type as any)) {
      return NextResponse.json({ error: 'File must be an image (jpeg, png, webp, gif)' }, { status: 400 });
    }

    if (file.size > uploadConfig.maxFileSizeBytes) {
      return NextResponse.json(
        { error: `File size must be less than ${uploadConfig.maxFileSizeBytes / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Compress image to stay within maxOutputSizeBytes (1 MB)
    let quality = uploadConfig.jpegQuality;
    let processedBuffer: Buffer;

    do {
      processedBuffer = await sharp(buffer)
        .resize(uploadConfig.maxWidth, uploadConfig.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality })
        .toBuffer();

      quality -= uploadConfig.jpegQualityDecrement;
    } while (processedBuffer.length > uploadConfig.maxOutputSizeBytes && quality > uploadConfig.minJpegQuality);

    const timestamp = Date.now();
    const filename = `product-${timestamp}.jpg`;
    const storagePath = `products/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(supabaseConfig.storage.bucket)
      .upload(storagePath, processedBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from(supabaseConfig.storage.bucket)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      filename,
    });
  } catch (error: any) {
    console.error('Upload error:', error);

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};
