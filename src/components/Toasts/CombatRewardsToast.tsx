import type { CombatData } from "../../types/types";

interface CombatRewardsToastProps {
    combatData: CombatData;
}

const CombatRewardsToast = ({ combatData }: CombatRewardsToastProps) => {
    const monster = combatData?.monster;
    const outcome = combatData?.state?.outcome;
    return (
        <div className='flex flex-row w-full justify-between items-center gap-1'>
            <div>
                You defeated <span className="text-red-500">{monster?.name}</span> and gained <span className="text-green-600">{outcome?.rewards?.experience}</span> experience
                {(outcome?.rewards?.gold && outcome?.rewards?.gold > 0) ? <> and <span className="text-yellow-500">{outcome?.rewards?.gold}</span> gold!</> : '!'}
            </div>
            <div className='w-1/5'>
                <img src='images/swords.png' />
            </div>
        </div>
    );
}

export default CombatRewardsToast;