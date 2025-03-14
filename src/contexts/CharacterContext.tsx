import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Character } from '../types/types';
import { getCharacter } from '../lib/api-client';
import { useSupabase } from '../contexts/SupabaseContext';

interface CharacterContextProps {
    character: Character | null;
    setCharacter: (character: Character) => void;
}

const CharacterContext = createContext<CharacterContextProps | undefined>(undefined);

export const CharacterProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { supabaseUser } = useSupabase();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGetCharacter = async () => {
        if (!character) {
            setLoading(true);
        }
        try {
            const character = await getCharacter();
            setCharacter(character)
        } catch (error) {
            console.log(error);
            navigate('/character/create');
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (supabaseUser) {
            handleGetCharacter();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    if (loading) {
        return <div>Loading Character...</div>
    }

    return (
        <CharacterContext.Provider value={{ character, setCharacter }}>
            {children}
        </CharacterContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCharacter = () => {
    const context = useContext(CharacterContext);
    if (!context) {
        throw new Error('useCharacter must be used within a CharacterProvider');
    }
    return context;
}