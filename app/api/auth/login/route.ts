import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminCredentials, createAdminToken } from '@/lib/auth';
import { LoginFormSchema } from '@/lib/validations/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = LoginFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    // Verify credentials
    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Create token
    const token = await createAdminToken(username);

    // Create response with cookie
    const response = NextResponse.json({ 
      success: true,
      message: 'Login berhasil'
    });

    // Set httpOnly cookie directly on response
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
