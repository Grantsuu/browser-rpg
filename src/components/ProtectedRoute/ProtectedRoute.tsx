import { Navigate, Outlet } from 'react-router';
import { useSupabase } from '../../contexts/SupabaseContext';

type ProtectedRouteProps = {
    redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/" }: ProtectedRouteProps) => {
    const { supabaseUser } = useSupabase();

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