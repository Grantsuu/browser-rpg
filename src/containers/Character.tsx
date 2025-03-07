import { useState, useEffect } from 'react';
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import PageCard from '../layouts/PageCard';

const Character = () => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <PageCard title="Character" icon={faUserShield} loading={loading}>
            <></>
        </PageCard>
    )
}

export default Character;