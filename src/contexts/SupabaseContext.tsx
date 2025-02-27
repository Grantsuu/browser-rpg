import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, SupabaseClient, createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

interface SupabaseContextProps {
    supabaseClient: SupabaseClient | null;
    supabaseSession: Session | null;
    supabaseUser: User | null;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
    const [client, setClient] = useState<SupabaseClient | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setClient(supabase);
    }, []);

    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error getting session:", error);
                setLoading(false);
                return;
            }
            setSession(data?.session);
            setUser(data?.session?.user ? data.session.user : null);
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                setUser(session?.user ? session.user : null);
                setSession(session);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setSession(null);
            }
        });

        // Ensure the listener is removed when the component unmounts
        return () => subscription.unsubscribe();
    }, [client]);

    const value: SupabaseContextProps = {
        supabaseClient: client, supabaseSession: session, supabaseUser: user
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return <SupabaseContext value={value}>{!loading && children}</SupabaseContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error('useSupabase must be used within an SupabaseProvider');
    }
    return context;
};