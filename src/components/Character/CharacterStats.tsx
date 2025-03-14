// import { Character } from "../../types/types";
import { useCharacter } from '../../contexts/CharacterContext';

const CharacterStats = () => {
    const { character } = useCharacter();
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h3 className="text-lg font-semibold">Name</h3>
                <p>{character?.name}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold">Gold</h3>
                <p>{character?.gold}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold">Farming Experience</h3>
                <p>{character?.farming_experience}</p>
            </div>
        </div>
    )
}

export default CharacterStats;