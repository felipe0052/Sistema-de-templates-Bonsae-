import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validação rigorosa para evitar qualquer tentativa de conexão externa se não houver dados reais
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('seu-projeto') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'sua-anon-key-aqui' &&
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseAnonKey !== 'placeholder' &&
  supabaseAnonKey.length > 20 // Chaves reais são longas
);

// Se não estiver configurado, usamos uma URL local impossível para garantir que o erro seja capturado internamente
export const supabase = createClient<Database>(
  isSupabaseConfigured ? supabaseUrl : 'http://localhost:54321', 
  isSupabaseConfigured ? supabaseAnonKey : 'no-key'
);
