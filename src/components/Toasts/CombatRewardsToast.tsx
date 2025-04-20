import React from "react";
import type { ItemImage, CombatOutcome } from "../../types/types";

interface CombatRewardsToastProps {
    outcome: CombatOutcome;
}

const CombatRewardsToast = ({ outcome }: CombatRewardsToastProps) => {
    return (
        <div className='flex flex-row w-full justify-between items-center gap-1'>
            <div>
                {action} <b>{amount}x</b> <span className="text-blue-500">{name}</span>{experience ? <> and gained <span className="text-green-600"><b>{experience}</b></span> experience!</> : extendedMessage ? extendedMessage : '.'}
            </div>
            {image ? <div className='w-1/4'>
                <img src={image?.base64} alt={image?.alt ? image.alt : ''} title={image?.alt ? image.alt : ''} />
            </div> : <></>}
        </div>
    );
}

export default CombatRewardsToast;