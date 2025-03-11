import { useState, useEffect } from 'react';
import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import PageCard from '../layouts/PageCard';

const Farming = () => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <PageCard title="Farming" icon={faSeedling} loading={loading}>
            <></>
        </PageCard>
    )
}

export default Farming;