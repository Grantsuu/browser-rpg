import { Navigate, Outlet, useLocation } from 'react-router';
import { useCharacter } from '../../lib/stateMangers';

const CharacterRoute = () => {
    const location = useLocation();
    const { data, isLoading } = useCharacter();

    if (isLoading) return <span className="loading loading-spinner loading-sm"></span>;

    // If user is logged in but no character, redirect to character create page
    if (!data && (location.pathname !== '/character/create') && (location.pathname !== '/account/update-password')) {
        return <Navigate to="/character/create" />;
    }

    // If user is logged in and has a character, redirect to character page
    if (data && location.pathname === '/character/create') {
        return <Navigate to="/character" />;
    }

    return <Outlet />;
};

export default CharacterRoute;