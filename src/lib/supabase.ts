import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://kzjcfmjrarebsvefyvxw.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qCrbOtRm1M12v4UlRqbETw_Azp687ft';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
