import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET_KEY || 'default-secret-key'
);

export interface AdminSession {
  username: string;
  isAdmin: boolean;
  exp: number;
}

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPasswordHash = process.env.ADMIN_PASSWORD;
  console.log('Admin username:', adminUsername);
  console.log('Admin password:', adminPasswordHash);

  if (!adminPasswordHash) {
    console.error('ADMIN_PASSWORD not configured in environment');
    return false;
  }

  if (username !== adminUsername) {
    return false;
  }

  try {
    return await bcrypt.compare(password, adminPasswordHash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Create admin JWT token
 */
export async function createAdminToken(username: string): Promise<string> {
  const token = await new SignJWT({ username, isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify admin JWT token
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminSession | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as unknown as AdminSession;
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Get admin session from cookies
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return null;
  }

  return verifyAdminToken(token);
}

/**
 * Set admin session cookie
 */
export async function setAdminSession(username: string): Promise<void> {
  const token = await createAdminToken(username);
  const cookieStore = await cookies();
  
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

/**
 * Clear admin session
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
}

/**
 * Require admin session (throw if not authenticated)
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  
  if (!session) {
    throw new Error('Unauthorized: Admin authentication required');
  }

  return session;
}

/**
 * Hash password utility (for generating admin password hash)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
