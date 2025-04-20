import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faFish, faHammer, faHouse, faRightFromBracket, faSeedling, faShop, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { getLogout } from '../lib/apiClient';

const Sidebar = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    // TODO: Make this part of a logout button component
    async function handleSignout() {
        try {
            await getLogout();
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            queryClient.clear();
            navigate("/login")
        }
    }

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
            {/* Navbar is 4rem so the rest of the content, determined by sidebar, should be 100vh - rem high */}
            <div className="drawer-content flex flex-col h-[calc(100dvh-4rem)] items-center justify-center bg-base-200 shadow-inner p-1 md:p-3 overflow-scroll">
                {children}
            </div>
            {/* Side Navigation Bar */}
            <div className="drawer-side w-full h-dvh lg:h-[calc(100dvh-4rem)] z-1">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-100 text-base-content h-full w-85 lg:w-70 p-2 justify-between text-xl md:text-lg lg:text-base">
                    <div>
                        <li><Link to="/" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faHouse as IconProp} className="w-5" />Home</Link></li>
                        <li><Link to="/character" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faUserShield as IconProp} className="w-5" />Character</Link></li>
                        <li><Link to="/shop" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faShop as IconProp} className="w-5" />Shop</Link></li>
                        <li><Link to="/inventory" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faBox as IconProp} className="w-5" />Inventory</Link></li>
                        <li><Link to="/training" onClick={() => setIsOpen(false)}><img src="images/swords.png" className="w-5" />Training</Link></li>
                        <li><Link to="/crafting" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faHammer as IconProp} className="w-5" />Crafting</Link></li>
                        <li><Link to="/farming" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faSeedling as IconProp} className="w-5" />Farming</Link></li>
                        <li><Link to="/fishing" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faFish as IconProp} className="w-5" />Fishing</Link></li>
                    </div>
                    <button type="submit" className="btn btn-error w-full" onClick={() => { handleSignout() }}>
                        <FontAwesomeIcon icon={faRightFromBracket as IconProp} /> Sign Out
                    </button>
                </ul>
            </div>
        </div >
    )
}

export default Sidebar;