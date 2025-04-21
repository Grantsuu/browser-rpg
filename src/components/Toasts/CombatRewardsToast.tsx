import React from "react";
import type { CombatOutcome } from "../../types/types";

interface CombatRewardsToastProps {
    outcome: CombatOutcome;
}

const CombatRewardsToast = ({ outcome }: CombatRewardsToastProps) => {
    const item = outcome?.rewards?.loot[0]?.item;
    return (
        <div className='flex flex-row w-full justify-between items-center gap-1'>
            <div>
                Gained {outcome?.rewards?.experience} experience and {outcome?.rewards?.gold} gold!
                {outcome?.rewards?.loot[0] ? <div className='flex flex-row items-center gap-1'>
                    <span className='text-sm'>Looted {outcome?.rewards?.loot[0]?.quanity}x</span>
                    <span className='text-sm'>{item?.name}</span>
                </div> : <></>}
            </div>
            {outcome?.rewards?.loot[0] ? <div className='w-1/4'>
                <img src={item?.image?.base64} alt={item?.image?.alt ? item?.image.alt : ''} title={item?.image?.alt ? item?.image.alt : ''} />
            </div> : <></>}
        </div>
    );
}

export default CombatRewardsToast;