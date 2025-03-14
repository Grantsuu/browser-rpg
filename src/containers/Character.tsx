import { Outlet } from 'react-router';
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import PageCard from '../layouts/PageCard';

const Character = () => {

    return (
        <PageCard title="Character" icon={faUserShield}>
            <Outlet />
        </PageCard>
    )
}

export default Character;