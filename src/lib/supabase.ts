import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://rdkkjkfmqjjitllmkhfk.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uDcDnyapO_RYUvFZkrbP0g_FkRL-IC3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
