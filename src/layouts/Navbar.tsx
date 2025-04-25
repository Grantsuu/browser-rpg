import { Link, useLocation } from 'react-router';
import { clsx } from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faFish, faHammer, faHouse, faSeedling, faShop, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import SignOutButton from '../components/Auth/SignOutButton';

const Navbar = () => {
    const location = useLocation();

    const toggleNavbar = () => {
        const navbarDrawer = document.getElementById('left-navbar-drawer');
        if (navbarDrawer) {
            navbarDrawer.click();
        }
    }

    const handleItemClick = () => {
        toggleNavbar();
    }

    return (
        // Side Navigation Bar
        <div className="drawer-side z-1 border-r-1 border-base-200">
            {/* This is the part that lets you click to close */}
            <label htmlFor="left-navbar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-100 text-base-content min-h-full w-80 lg:w-65 p-2 justify-between text-xl md:text-lg lg:text-base">
                <div>
                    {/* Title */}
                    <div className="flex w-full p-2 items-center justify-center">
                        <a className="btn btn-ghost text-2xl font-bold gap-2" href="/">Elvard <img src="/dragon.png" className="inline-block w-8 h-8" alt="Elvard" /></a>
                    </div>
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
                </div>
                <SignOutButton />
            </ul>
        </div>
    )
}

export default Navbar;