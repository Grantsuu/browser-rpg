import { Outlet } from 'react-router';
import PageContent from '@layouts/PageContent';
import Navbar from '@layouts/Navbar';

const Dashboard = () => {
    return (
        <div className="flex flex-col max-h-100vh max-w-full">
            <div className="drawer lg:drawer-open">
                <input
                    id="left-navbar-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <PageContent>
                    <Outlet />
                </PageContent>
                <Navbar />
            </div>
        </div>
    )
}

export default Dashboard;