import { useContext, useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router';
import { User } from '@supabase/supabase-js';
import { SupabaseContext } from '../../contexts/SupabaseContext'

type ProtectedRouteProps = {
    redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/" }: ProtectedRouteProps) => {
    const supabase = useContext(SupabaseContext);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {
                user ?
                    <Outlet /> :
                    <Navigate to={redirectPath} />
            }
        </>
    )
};

export default ProtectedRoute;