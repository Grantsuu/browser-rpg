import { createContext, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const SupabaseContext = createContext();

const SupabaseProvider = ({ children }) => {
    const [supabase, setSupabase] = useState<SupabaseClient>(createClient(supabaseUrl, supabaseKey));

    return <SupabaseContext value={supabase}>{children}</SupabaseContext>
}

export { SupabaseContext, SupabaseProvider };