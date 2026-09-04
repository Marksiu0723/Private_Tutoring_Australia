import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidSupabaseUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (url.includes('PASTE_YOUR') || url.includes('placeholder')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured =
  isValidSupabaseUrl(rawUrl) &&
  Boolean(rawAnonKey && !rawAnonKey.includes('PASTE_YOUR'));

// Fallback URL strictly so @supabase/supabase-js does not crash on instantiation
const supabaseUrl = isSupabaseConfigured && rawUrl
  ? rawUrl
  : 'https://demo-placeholder-project.supabase.co';

const supabaseAnonKey = isSupabaseConfigured && rawAnonKey
  ? rawAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
