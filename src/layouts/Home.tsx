import { useContext } from 'react';
import { useNavigate, Outlet } from 'react-router';
import { SupabaseContext } from "../contexts/SupabaseContext"
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Home = () => {
    const supabase = useContext(SupabaseContext);
    const navigate = useNavigate();

    async function handleSignout() {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            console.log('signed out succesfully');
            navigate("/login")
        }
    }

    return (
        <div>
            {/* Top Navigation Bar */}
            <Navbar />
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                {/* Side Navigation Bar */}
                <Sidebar />
                {/* Content */}
                <div className="drawer-content flex flex-col items-center justify-center bg-base-200 shadow-inner">
                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                        Open drawer
                    </label>
                    <Outlet />
                    Logged in!
                    <div>
                        <button type="submit" className="btn btn-primary mb-2" onClick={() => { handleSignout() }}>
                            Signout
                        </button>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default Home;