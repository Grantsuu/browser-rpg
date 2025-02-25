import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { SupabaseContext } from "../contexts/SupabaseContext"
const Home = () => {
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
        <div>
            Logged in!
            <div>
                <button type="submit" className="btn btn-primary mb-2" onClick={() => { handleSignout() }}>
                    Signout
                </button>
            </div>
        </div>
    )
}

export default Home;