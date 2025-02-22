import { useContext, useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router';
import { SupabaseContext } from '../../contexts/SupabaseContext'

type ProtectedRouteProps = {
    redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/" }: ProtectedRouteProps) => {
    const supabaseContext = useContext(SupabaseContext);
    const [session, setSession] = useState(null);

    const { supabase } = supabaseContext;

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