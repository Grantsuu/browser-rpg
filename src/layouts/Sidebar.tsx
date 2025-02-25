import { useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faHammer, faHouse, faRightFromBracket, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { SupabaseContext } from "../contexts/SupabaseContext"

const Sidebar = () => {
    const supabase = useContext(SupabaseContext);
    const navigate = useNavigate();
    async function handleSignout() {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            console.log('signed out succesfully');
            navigate("/login")
        }
    }

    return (
        // Navbar is 4rem so the rest of the content, determined by sidebar, should be 100vh - rem high
        <div className="drawer-side h-[calc(100vh-4rem)]">
            <div className="flex flex-col h-full justify-between">
                <div>
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-100 text-base-content w-70 p-4">
                        {/* Sidebar content here */}
                        <li><Link to="/"><FontAwesomeIcon icon={faHouse as IconProp} className="w-5" />Home</Link></li>
                        <li><Link to="/"><FontAwesomeIcon icon={faUserShield as IconProp} className="w-5" />Character</Link></li>
                        <li><Link to="/inventory"><FontAwesomeIcon icon={faBox as IconProp} className="w-5" />Inventory</Link></li>
                        <li><Link to="/"><FontAwesomeIcon icon={faHammer as IconProp} className="w-5" />Crafting</Link></li>
                    </ul>
                </div>
                <div className="p-2">
                    <button type="submit" className="btn btn-primary w-full" onClick={() => { handleSignout() }}>
                        <FontAwesomeIcon icon={faRightFromBracket as IconProp} /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;