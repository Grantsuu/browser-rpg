import { Outlet } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getCraftingRecipes, getCrops, getFish, getMonsters } from '@lib/apiClient';
import { useCharacterBounties, useCharacterLevels } from '@lib/stateMangers';
import PageContent from '@layouts/PageContent';
import Navbar from '@layouts/Navbar';

const Dashboard = () => {
    // We need character levels
    const { isLoading: isLevelsLoading } = useCharacterLevels();
    // For bounties we need all game data on monster, fishing, farming, and cooking recipes
    const { isLoading: isBountiesLoading } = useCharacterBounties();
    const { isLoading: isMonstersLoading } = useQuery({
        queryKey: ['allMonsters'],
        queryFn: () => getMonsters()
    });

    const { isLoading: isFishingLoading } = useQuery({
        queryKey: ['allFishing'],
        queryFn: getFish
    });

    const { isLoading: isCropsLoading } = useQuery({
        queryKey: ['allCrops'],
        queryFn: getCrops
    });

    const { isLoading: isCookingLoading } = useQuery({
        queryKey: ['allCooking'],
        queryFn: getCraftingRecipes
    });

    return (
        <div className="flex flex-col max-h-100vh max-w-full">
            <div className="drawer lg:drawer-open">
                <input
                    id="left-navbar-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <PageContent>
                    {isLevelsLoading || isBountiesLoading || isMonstersLoading || isFishingLoading || isCropsLoading || isCookingLoading ?
                        <>Loading game data...</> :
                        <Outlet />
                    }
                </PageContent>
                <Navbar />
            </div>
        </div>
    )
}

export default Dashboard;