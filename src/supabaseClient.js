import { createClient } from '@supabase/supabase-js';

// Caso as variáveis de ambiente não estejam configuradas, usamos placeholders para evitar falhas em tempo de build
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-figucopa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
