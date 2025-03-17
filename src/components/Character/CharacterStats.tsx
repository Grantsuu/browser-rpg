import { useCharacter } from '../../lib/stateMangers';

const CharacterStats = () => {
    const { data } = useCharacter();
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h3 className="text-lg font-semibold">Name</h3>
                <p>{data?.name}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold">Gold</h3>
                <p>{data?.gold}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold">Farming Experience</h3>
                <p>{data?.farming_experience}</p>
            </div>
        </div>
    )
}

export default CharacterStats;