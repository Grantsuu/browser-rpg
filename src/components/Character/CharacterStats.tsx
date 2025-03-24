import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faSeedling, faKitchenSet } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useCharacter } from '../../lib/stateMangers';
import { experience_table } from '../constants/game/experience_table';

const CharacterStats = () => {
    const { data } = useCharacter();
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Name</h3>
                    <p>{data?.name}</p>
                </div>
                <div>
                    <div className="flex flex-row items-center gap-2">
                        <FontAwesomeIcon icon={faCoins as IconProp} />
                        <h3 className="text-lg font-semibold">Gold</h3>
                    </div>
                    <p>{data?.gold}</p>
                </div>
            </div>
            <div className="mt-4 prose">
                <h2>Skills</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <div className="flex flex-row items-center gap-2">
                        <FontAwesomeIcon icon={faSeedling as IconProp} />
                        <h3 className="text-lg font-semibold">Farming</h3>
                    </div>
                    <p>Level: {data?.farming_level}</p>
                    <p>Experience: {data?.farming_experience}/{experience_table[data?.farming_level + 1 as keyof typeof experience_table]}</p>
                </div>
                <div>
                    <div className="flex flex-row items-center gap-2">
                        <FontAwesomeIcon icon={faKitchenSet as IconProp} />
                        <h3 className="text-lg font-semibold">Cooking</h3>
                    </div>
                    <p>Level: {data?.cooking_level}</p>
                    <p>Experience: {data?.cooking_experience}/{experience_table[data?.cooking_level + 1 as keyof typeof experience_table]}</p>
                </div>
            </div>
        </div>
    )
}

export default CharacterStats;