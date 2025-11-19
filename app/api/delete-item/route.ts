import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  try {
    const { itemId, imageUrl } = await request.json();
    const authHeader = request.headers.get('Authorization');

    console.log('Received itemId:', itemId);
    console.log('Received imageUrl:', imageUrl);
    console.log('Authorization header:', authHeader);

    if (!itemId || !imageUrl) {
      return NextResponse.json({ error: 'Item ID and image URL are required' }, { status: 400 });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Get authenticated user using the provided token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Auth error:', authError?.message || 'No user found');
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    console.log('Authenticated user ID:', user.id);

    // Delete item from Supabase
    const { error: dbError } = await supabase
      .from('wardrobe_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id);

    if (dbError) {
      console.error('Database error:', dbError.message);
      return NextResponse.json({ error: 'Failed to delete item: ' + dbError.message }, { status: 400 });
    }

    // Extract public_id from Cloudinary URL (e.g., closefit_wardrobe/jyvpbiagvuwre7idrylj)
    const publicId = imageUrl.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, '');
    console.log('Cloudinary public_id:', publicId);

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('Delete item error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}