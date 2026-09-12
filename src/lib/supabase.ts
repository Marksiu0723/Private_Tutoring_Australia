import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidSupabaseUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (url.includes('PASTE_YOUR') || url.includes('placeholder') || url.includes('demo-placeholder')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured =
  isValidSupabaseUrl(rawUrl) &&
  Boolean(rawAnonKey && typeof rawAnonKey === 'string' && !rawAnonKey.includes('PASTE_YOUR') && rawAnonKey.length > 20);

// Safe proxy client that prevents any runtime crash when Supabase is unconfigured (e.g. on static GitHub Pages)
function createDummyClient(): SupabaseClient<any> {
  const dummyAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
    signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: new Error('Supabase not configured') }),
    getUser: async () => ({ data: { user: null }, error: null }),
  };

  const chainableQuery: any = {
    select: () => chainableQuery,
    order: () => chainableQuery,
    limit: () => chainableQuery,
    eq: () => chainableQuery,
    neq: () => chainableQuery,
    maybeSingle: async () => ({ data: null, error: null }),
    single: async () => ({ data: null, error: null }),
    insert: async () => ({ data: null, error: new Error('Supabase not configured') }),
    update: () => chainableQuery,
    delete: () => chainableQuery,
    then: (resolve: any) => Promise.resolve({ data: [], error: null }).then(resolve),
  };

  return {
    auth: dummyAuth,
    from: () => chainableQuery,
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: `mock_${Date.now()}` }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
      }),
    },
  } as unknown as SupabaseClient<any>;
}

let clientInstance: SupabaseClient<any>;

if (isSupabaseConfigured && rawUrl && rawAnonKey) {
  try {
    clientInstance = createClient<any>(rawUrl, rawAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client. Falling back to offline client.', err);
    clientInstance = createDummyClient();
  }
} else {
  clientInstance = createDummyClient();
}

export const supabase = clientInstance;

