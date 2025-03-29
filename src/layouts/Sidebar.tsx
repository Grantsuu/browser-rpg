import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faHammer, faHouse, faRightFromBracket, faSeedling, faShop, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useSupabase } from "../contexts/SupabaseContext"

const Sidebar = ({ children }: { children: React.ReactNode }) => {
    const { supabaseClient } = useSupabase();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    async function handleSignout() {
        try {
            await supabaseClient?.auth.signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
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
            <div className="drawer-content flex flex-col h-[calc(100dvh-4rem)] items-center justify-center bg-base-200 shadow-inner p-5 overflow-scroll">
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
                        <li><Link to="/crafting" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faHammer as IconProp} className="w-5" />Crafting</Link></li>
                        <li><Link to="/farming" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faSeedling as IconProp} className="w-5" />Farming</Link></li>
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