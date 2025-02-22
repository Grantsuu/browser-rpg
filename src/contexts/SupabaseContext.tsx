import { createContext } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseContext = createContext(supabase);

const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
    return <SupabaseContext value={supabase}>{children}</SupabaseContext>
}

export { SupabaseContext, SupabaseProvider };