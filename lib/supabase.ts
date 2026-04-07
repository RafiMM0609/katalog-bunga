import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

// Lazy singleton server client for API routes
let _supabase: SupabaseClient | undefined;

function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    _supabase = createServerClient();
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
  has(_target, prop) {
    return prop in getSupabaseClient();
  },
  ownKeys(_target) {
    return Reflect.ownKeys(getSupabaseClient());
  },
  getOwnPropertyDescriptor(_target, prop) {
    return Reflect.getOwnPropertyDescriptor(getSupabaseClient(), prop);
  },
});
