import { useContext, useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router';
import { Session } from '@supabase/supabase-js';
import { SupabaseContext } from '../../contexts/SupabaseContext'

type ProtectedRouteProps = {
    redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/" }: ProtectedRouteProps) => {
    const supabase = useContext(SupabaseContext);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!session) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;