import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import { getCharacter } from '../lib/api-client';
import PageCard from '../layouts/PageCard';

const Character = () => {
    const [loading, setLoading] = useState(false);
    const [character, setCharacter] = useState({});

    const handleGetCharacter = async () => {
        setLoading(true);
        try {
            const character = await getCharacter();
            setCharacter(character);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetCharacter();
    }, []);

    return (
        <PageCard title="Character" icon={faUserShield}>
            <Outlet />
        </PageCard>
    )
}

export default Character;