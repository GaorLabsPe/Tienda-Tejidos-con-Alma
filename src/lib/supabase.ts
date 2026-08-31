import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL !== 'https://your-project.supabase.co' &&
  !SUPABASE_URL.includes('your-project')
);

// Cliente Supabase conectado al esquema 'tejidos' o 'public'
export const supabase: SupabaseClient<any, any, any> | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      db: {
        schema: 'tejidos',
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
