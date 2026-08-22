/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || 'https://qvaredaumseyyiyqiymy.supabase.co';
const supabaseKey: string = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Ye3X42i_JQAGTU9LOmI5ww_GdC6d18i';

export const supabase = createClient(supabaseUrl, supabaseKey);

