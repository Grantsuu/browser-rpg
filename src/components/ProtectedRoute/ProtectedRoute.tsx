import { Navigate, Outlet, useLocation } from 'react-router';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useCharacter } from '../../lib/characterStateManager';

type ProtectedRouteProps = {
    redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/" }: ProtectedRouteProps) => {
    const location = useLocation();
    const { supabaseUser } = useSupabase();
    const { data, isLoading } = useCharacter();

    if (isLoading) return <span className="loading loading-spinner loading-sm"></span>;

    // If no user is logged in, redirect to login page
    if (!supabaseUser) {
        return <Navigate to={redirectPath} />;
    }

    // If user is logged in but no character, redirect to character create page
    if (!data && location.pathname !== '/character/create') {
        return <Navigate to="/character/create" />;
    }

    // If user is logged in and has a character, redirect to character page
    if (data && location.pathname === '/character/create') {
        return <Navigate to="/character" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;