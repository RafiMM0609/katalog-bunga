/**
 * Centralized configuration for Kagitacraft
 * All app-wide settings are managed here.
 */

// ===== SUPABASE =====
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  storage: {
    bucket: 'product-images',
  },
} as const;

// ===== SITE =====
export const siteConfig = {
  name: 'Kagitacraft',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kagitacraft.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER || '6281234567890',
} as const;

// ===== ADMIN AUTH =====
export const authConfig: {
  readonly jwtSecret: string;
  readonly cookieName: 'admin_token';
  readonly tokenExpiry: '24h';
  readonly cookieMaxAge: number;
} = {
  get jwtSecret(): string {
    const secret = process.env.ADMIN_SECRET_KEY;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SECRET_KEY environment variable must be set in production');
    }
    return secret || 'default-secret-key';
  },
  cookieName: 'admin_token',
  tokenExpiry: '24h',
  cookieMaxAge: 60 * 60 * 24, // 24 hours in seconds
};

// ===== IMAGE UPLOAD =====
export const uploadConfig = {
  maxOutputSizeBytes: 1 * 1024 * 1024,  // 1 MB after compression
  maxWidth: 800,
  maxHeight: 1000,
  webpQuality: 82,
  webpQualityDecrement: 5,              // step to reduce quality in adaptive loop
  minWebpQuality: 10,                   // floor quality before giving up
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// ===== PAGINATION =====
export const paginationConfig = {
  defaultPage: 1,
  defaultPerPage: 10,
} as const;
