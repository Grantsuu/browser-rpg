import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Dashboard = () => {
    return (
        <div className="flex flex-col max-h-full">
            {/* Top Navigation Bar */}
            <Navbar />
            <Sidebar>
                <Outlet />
            </Sidebar>
        </div>
    )
}

export default Dashboard;