import { Outlet } from 'react-router';
import PageCard from '@layouts/PageCard';

const Character = () => {

    return (
        <PageCard title="Character" icon='/images/knight.png'>
            <Outlet />
        </PageCard>
    )
}

export default Character;