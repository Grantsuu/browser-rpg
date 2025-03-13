import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useSupabase } from '../../contexts/SupabaseContext'
import { getCharacterId } from '../../lib/api-client';

type ProtectedRouteProps = {
    redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/" }: ProtectedRouteProps) => {
    const { supabaseUser } = useSupabase();
    const [characterId, setCharacterId] = useState<number | null>(null);

    const handleGetCharacterId = async () => {
        try {
            const characterId = await getCharacterId();
            setCharacterId(characterId);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (supabaseUser) {
            handleGetCharacterId();
        }
    }, [supabaseUser]);

    return (
        <>
            {
                supabaseUser ?
                    characterId ?
                        <Outlet /> :
                        <><Navigate to="/character" /><Outlet /></> :
                    <Navigate to={redirectPath} />
            }
        </>
    )
};

export default ProtectedRoute;