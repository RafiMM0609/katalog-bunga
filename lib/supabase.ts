import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

// Browser-safe client (uses anon key)
export function createBrowserClient() {
  return createClient(supabaseConfig.url, supabaseConfig.anonKey);
}

// Server-side admin client (uses service role key, bypasses RLS)
export function createServerClient() {
  return createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

// Singleton server client for API routes
export const supabase = createServerClient();
