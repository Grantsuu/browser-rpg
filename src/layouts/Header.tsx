/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useGameStore } from "@src/stores/gameStore";
import { useCharacter, useCharacterBounties } from '@lib/stateMangers';
import type { Bounty } from "@src/types";
import SignOutButton from '../components/Auth/SignOutButton';
import ThemeController from '@src/components/ThemeController/ThemeController';
import ProgressBar from '@src/components/Animated/ProgressBar';

const Header = () => {
    const gameStore = useGameStore();
    const { data } = useCharacter();
    const { data: bounties } = useCharacterBounties();

    useEffect(() => {
        const trackedBounty = localStorage.getItem('trackedBounty');
        if (trackedBounty) {
            // If it exists, set it in the store
            const parsedBounty = JSON.parse(trackedBounty) as Bounty;
            gameStore.setTrackedBounty(parsedBounty);
        }
        if (bounties) {
            // If bounties exist check if the tracked bounty is in the bounties
            const trackedBounty = bounties.find((bounty: Bounty) => bounty.id === gameStore.trackedBounty?.id);
            if (!trackedBounty) {
                // If the tracked bounty is not in the bounties, set it to undefined and remove it from local storage
                gameStore.setTrackedBounty(undefined);
                localStorage.removeItem('trackedBounty');
            }
        }
    }, [bounties]);

    return (
        <div className="navbar sticky top-0 z-1 bg-base-100 border-b-1 border-base-200 justify-between">
            {/* Drawer for mobile/tablet view */}
            <label htmlFor="left-navbar-drawer" className="btn btn-ghost btn-circle lg:hidden">
                <FontAwesomeIcon icon={faBars as IconProp} size="2x" />
            </label>
            <div></div>
            {/* Profile */}
            <div className="flex flex-row gap-2 items-center">
                {/* Bounty Tracker */}
                {gameStore?.trackedBounty &&
                    <div className="flex flex-col gap-1 border-2 border-primary rounded-md p-1 bg-base-100 text-sm">
                        <div className="flex flex-row gap-1 items-center">
                            <img
                                src={gameStore?.trackedBounty?.category === 'gathering' ? '/images/gathering.png' : gameStore?.trackedBounty?.category === 'crafting' ? '/images/crafting.png' : '/images/swords.png'}
                                alt="Bounty"
                                className="w-5"
                            />
                            {`${gameStore?.trackedBounty?.name}: ${gameStore?.trackedBounty?.required_progress}/${gameStore?.trackedBounty?.required_quantity}`}
                        </div>
                        <ProgressBar
                            backgroundClassName='h-2'
                            width={gameStore?.trackedBounty?.required_progress / gameStore?.trackedBounty?.required_quantity}
                        />
                    </div>}
                <ThemeController />
                {/* <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
                            <span className="badge badge-sm indicator-item">8</span>
                        </div>
                    </div>
                    <div
                        tabIndex={0}
                        className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                        <div className="card-body">
                            <span className="text-lg font-bold">8 Items</span>
                            <span className="text-info">Subtotal: $999</span>
                            <div className="card-actions">
                                <button className="btn btn-primary btn-block">View cart</button>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="dropdown dropdown-end">
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <div className="hidden sm:inline-block">
                            {data?.name}
                        </div>
                        <div tabIndex={0} role="button" className="btn btn-circle w-15">
                            <div className="w-10 rounded-full">
                                <FontAwesomeIcon icon={faUser as IconProp} size="2x" />
                            </div>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                                {/* <span className="badge">New</span> */}
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                        <li><SignOutButton className="btn-sm" /></li>
                    </ul>
                </div>
            </div>
        </div >
    )
}

export default Header;