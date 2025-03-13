import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useSupabase } from '../../contexts/SupabaseContext'
import { getCharacterId } from '../../lib/api-client';

type ProtectedRouteProps = {
    redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/" }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);

    const { supabaseUser } = useSupabase();

    const handleGetCharacterId = async () => {
        setLoading(true);
        try {
            await getCharacterId();
        } catch (error) {
            console.log(error);
            navigate('/character');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Every time we navigate to a new url we want to force the player back to the character page if they don't have one yet
        handleGetCharacterId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            {supabaseUser ?
                <Outlet /> :
                <Navigate to={redirectPath} />
            }
        </>
    )
};

export default ProtectedRoute;