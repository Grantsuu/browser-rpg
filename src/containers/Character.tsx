// import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
// import { Character } from '../types/types';
// import { useCharacter } from '../contexts/CharacterContext';
import PageCard from '../layouts/PageCard';

const Character = () => {
    // const character = useCharacter();
    // const [loading, setLoading] = useState(false);
    // const [character, setCharacter] = useState({});

    // useEffect(() => {
    //     handleGetCharacter();
    //     console.log(character);
    //     console.log(loading);
    // }, []);

    return (
        <PageCard title="Character" icon={faUserShield}>
            <Outlet />
        </PageCard>
    )
}

export default Character;