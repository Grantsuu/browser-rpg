import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import PageCard from '../layouts/PageCard';

const Character = () => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        console.log(loading);
        setLoading(false);
    }, []);

    return (
        <PageCard title="Character" icon={faUserShield}>
            <Outlet />
        </PageCard>
    )
}

export default Character;