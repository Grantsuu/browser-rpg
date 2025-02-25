import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Dashboard = () => {
    return (
        <div className="flex flex-col max-h-full">
            {/* Top Navigation Bar */}
            <Navbar />
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                {/* Side Navigation Bar */}
                <Sidebar />
                {/* Content */}
                <div className="drawer-content flex flex-col items-center justify-center bg-base-200 shadow-inner p-5 max-h-[calc(100vh-4rem)]">
                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                        Open drawer
                    </label>
                    <Outlet />
                </div>

            </div>
        </div >
    )
}

export default Dashboard;