import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { clsx } from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faFish, faHammer, faHouse, faSeedling, faShop, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import SignOutButton from '../components/Auth/SignOutButton';

const Navbar = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const handleItemClick = () => {
        setIsOpen(false);
    }

    console.log(location.pathname);
    return (
        <div className="drawer lg:drawer-open">
            <input
                id="my-drawer-2"
                type="checkbox"
                checked={isOpen}
                onChange={() => setIsOpen(!isOpen)}
                className="drawer-toggle"
            />
            {/* Content */}
            {/* Header is 4rem so the rest of the content, determined by sidebar, should be 100vh - rem high */}
            <div className="drawer-content flex flex-col h-[calc(100dvh-4rem)] items-center justify-center bg-base-200 shadow-inner p-1 md:p-3 overflow-scroll">
                {children}
            </div>
            {/* Side Navigation Bar */}
            <div className="drawer-side w-full h-dvh lg:h-[calc(100dvh-4rem)] z-1">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-100 text-base-content h-full w-85 lg:w-70 p-2 justify-between text-xl md:text-lg lg:text-base">
                    <div>
                        <li>
                            <Link
                                to="/"
                                onClick={() => handleItemClick()}
                                className={clsx(`${location.pathname.includes('home') ? 'menu-active' : ''}`)}
                            >
                                <FontAwesomeIcon icon={faHouse as IconProp} />Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/character"
                                onClick={() => handleItemClick()}
                                className={clsx(`${location.pathname.includes('character') ? 'menu-active' : ''}`)}
                            >
                                <FontAwesomeIcon icon={faUserShield as IconProp} />Character
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/shop"
                                onClick={() => handleItemClick()}
                                className={clsx(`${location.pathname.includes('shop') ? 'menu-active' : ''}`)}
                            >
                                <FontAwesomeIcon icon={faShop as IconProp} />Shop
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/inventory"
                                onClick={() => handleItemClick()}
                                className={clsx(`${location.pathname.includes('inventory') ? 'menu-active' : ''}`)}
                            >
                                <FontAwesomeIcon icon={faBox as IconProp} />Inventory
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/training"
                                onClick={() => handleItemClick()}
                                className={clsx(`${location.pathname.includes('training') ? 'menu-active' : ''}`)}
                            >
                                <img src="images/swords.png" className="w-5" />Training
                            </Link>
                        </li>
                        <li>
                            <details open>
                                <summary><img src='images/skills.png' className="w-5" />Skills</summary>
                                <ul>
                                    <li>
                                        <Link
                                            to="/crafting"
                                            onClick={() => handleItemClick()}
                                            className={clsx(`${location.pathname.includes('crafting') ? 'menu-active' : ''}`)}
                                        >
                                            <FontAwesomeIcon icon={faHammer as IconProp} />Crafting
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/farming"
                                            onClick={() => handleItemClick()}
                                            className={clsx(`${location.pathname.includes('farming') ? 'menu-active' : ''}`)}
                                        >
                                            <FontAwesomeIcon icon={faSeedling as IconProp} />Farming
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/fishing"
                                            onClick={() => handleItemClick()}
                                            className={clsx(`${location.pathname.includes('fishing') ? 'menu-active' : ''}`)}
                                        >
                                            <FontAwesomeIcon icon={faFish as IconProp} />Fishing
                                        </Link>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </div>
                    <SignOutButton />
                </ul>
            </div>
        </div>
    )
}

export default Navbar;