import { Outlet } from 'react-router';
import Header from './Header';
import Navbar from './Navbar';

const Dashboard = () => {
    return (
        <div className="flex flex-col max-h-full">
            {/* Top Navigation Bar */}
            <Header />
            <Navbar>
                <Outlet />
            </Navbar>
        </div>
    )
}

export default Dashboard;