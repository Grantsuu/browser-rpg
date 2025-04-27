import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faFish, faSeedling, faKitchenSet } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useCharacter, useCharacterCombatStats, useCharacterLevels } from '@lib/stateMangers';
import { experience_table } from '@constants/game/experience_table';
import SkillLevelDisplay from './SkillLevelDisplay';
import ProgressBar from '@src/components/Animated/ProgressBar';

const CharacterStats = () => {
    const { data: character, isLoading: isCharacterLoading } = useCharacter();
    const { data: levels, isLoading: isLevelsLoading } = useCharacterLevels();
    const { data: combatStats, isLoading: isCombatStatsLoading } = useCharacterCombatStats();

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Name</h3>
                    {isCharacterLoading ? <div className="skeleton h-4 w-full md:w-1/2 lg:w-1/3"></div> : <p>{character?.name}</p>}
                </div>
                <div>
                    <div className="flex flex-row items-center gap-2">
                        <FontAwesomeIcon icon={faCoins as IconProp} />
                        <h3 className="text-lg font-semibold">Gold</h3>
                    </div>
                    {isCharacterLoading ? <div className="skeleton h-4 w-full md:w-1/3 lg:w-1/4"></div> : <p>{character?.gold}</p>}
                </div>
            </div>
            <div className="mt-4 prose">
                <h2>Combat</h2>
            </div>
            {/* Combat Stats */}
            <div className=" w-full md:w-1/2 xl:w-1/4">
                <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row items-center gap-1">
                        <span className="font-semibold">Health:</span>
                        {isCombatStatsLoading ? <></> : `${combatStats?.health}/${combatStats?.max_health}`}
                    </div>
                    {isCombatStatsLoading ? <div className="skeleton h-4 w-full"></div> : <ProgressBar foregroundClassName="bg-red-500" width={Math.floor(combatStats?.health / combatStats?.max_health * 100)} />}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-semibold">Power:</span> {isCombatStatsLoading ? <div className="skeleton h-4 w-full"></div> : combatStats?.power}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-semibold">Toughness:</span> {isCombatStatsLoading ? <div className="skeleton h-4 w-full"></div> : combatStats?.toughness}
                </div>
            </div>
            {/* Combat Levels*/}
            <div className="grid grid-cols-3 gap-4">
                <SkillLevelDisplay
                    title={'Combat'}
                    icon='/images/swords.png'
                    level={levels?.combat_level}
                    experience={levels?.combat_experience}
                    maxExperience={experience_table[levels?.combat_level + 1 as keyof typeof experience_table]}
                    isLoading={isLevelsLoading}
                />
            </div>
            <div className="mt-4 prose">
                <h2>Skills</h2>
            </div>
            {/* Skills */}
            <div className="grid grid-cols-3 gap-4">
                <SkillLevelDisplay
                    title="Farming"
                    icon={faSeedling as IconProp}
                    level={levels?.farming_level}
                    experience={levels?.farming_experience}
                    maxExperience={experience_table[levels?.farming_level + 1 as keyof typeof experience_table]}
                    isLoading={isLevelsLoading}
                />
                <SkillLevelDisplay
                    title="Cooking"
                    icon={faKitchenSet as IconProp}
                    level={levels?.cooking_level}
                    experience={levels?.cooking_experience}
                    maxExperience={experience_table[levels?.cooking_level + 1 as keyof typeof experience_table]}
                    isLoading={isLevelsLoading}
                />
                <SkillLevelDisplay
                    title="Fishing"
                    icon={faFish as IconProp}
                    level={levels?.fishing_level}
                    experience={levels?.fishing_experience}
                    maxExperience={experience_table[levels?.fishing_level + 1 as keyof typeof experience_table]}
                    isLoading={isLevelsLoading}
                />
            </div>
        </div>
    )
}

export default CharacterStats;