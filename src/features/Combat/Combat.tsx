import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react"
import { toast } from 'react-toastify';
import type { CombatData } from "../../types/types";
import { useCharacter } from "../../lib/stateMangers";
import { putResetCombat, putUpdateCombat } from "../../lib/apiClient";

interface CombatProps {
    combat: CombatData;
}

const Combat = ({ combat }: CombatProps) => {
    const queryClient = useQueryClient();
    const { data: character } = useCharacter();

    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        if (showAnimation) {
            setShowAnimation(false);
        }
    }, [showAnimation]);

    const { mutateAsync: updateCombat, isPending: combatLoading } = useMutation({
        mutationFn: (variables: { action: string, monsterId?: number }) => putUpdateCombat(variables.action, variables.monsterId),
        onSuccess: (data) => {
            setShowAnimation(true);
            queryClient.setQueryData(['combat'], data);
        },
        onError: (error) => {
            toast.error(`Something went wrong starting combat: ${(error as Error).message}`);
        }
    });

    const { mutateAsync: resetCombat, isPending: resetLoading } = useMutation({
        mutationFn: () => putResetCombat(),
        onSuccess: (data) => {
            queryClient.setQueryData(['combat'], data);
        },
        onError: (error) => {
            toast.error(`Something went wrong resetting combat: ${(error as Error).message}`);
        }
    });

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="card card-lg border border-gray-100 shadow-md w-full lg:w-1/3">
                <div className="card-body p-3 items-center">
                    <h2 className="card-title text-center">{combat.monster.name}</h2>
                    <div className="relative z-0 w-1/3">
                        <AnimatePresence initial={false}>
                            {combat?.state?.last_actions?.player?.action === 'attack' && showAnimation && (
                                <motion.div
                                    initial={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0.0, y: -75 }}
                                    transition={{ duration: 1.00, ease: "circOut" }}
                                    key="monster-damage-animation"
                                    className="absolute z-10 flex justify-center items-center w-full h-full top-0 left-0"
                                >
                                    <div className="text-red-500 text-2xl font-bold">{combat?.state?.last_actions?.player?.amount}</div>
                                </motion.div>)}
                        </AnimatePresence >
                        <img src={combat.monster.image} alt={combat.monster.name} title={combat.monster.name} />
                    </div>
                    <div className="flex flex-row gap-1">
                        <img src="images/heart.png" className="w-5" />
                        <div className="font-semibold">{combat.monster.health}/{combat.monster.max_health}</div>
                    </div>
                    <div className="flex flex-row gap-1 w-full justify-center">
                        <progress className="progress progress-error size-lg w-4/5 h-4" value={(combat.monster.health / combat.monster.max_health) * 100} max="100"></progress>
                    </div>
                </div>
            </div>
            {combat?.state?.last_actions && <>
                {(combat?.state?.last_actions?.player) &&
                    <div className="flex flex-row gap-1">
                        {combat?.state?.last_actions?.player?.action === 'attack' &&
                            <>
                                <img src="images/sword.png" className="w-5" />
                                <span>
                                    <span className="font-semibold">{character.name}</span> <span className="text-red-500 italic">attacks</span> for <span className="text-red-500 font-bold">{combat?.state?.last_actions?.player?.amount}</span> damage!
                                </span>
                            </>}
                        {combat?.state?.last_actions?.player?.action === 'defend' &&
                            <>
                                <img src="images/shield.png" className="w-5" />
                                <span>
                                    <span className="font-semibold">{character.name}</span> <span className="text-green-500 italic">defends</span> and recovers <span className="text-green-500 font-bold">{combat?.state?.last_actions?.player?.amount}</span> health!
                                </span>
                            </>}
                        {((combat?.state?.last_actions?.player?.action === 'flee') && !combat?.state?.outcome) &&
                            <>
                                <img src="images/running.png" className="w-5" />
                                <span>
                                    <span className="font-semibold">{character.name}</span> <span className="text-red-500 italic">failed</span> to <span className="text-blue-500">flee</span>!
                                </span>
                            </>}
                    </div>}
                {combat?.state?.last_actions?.monster && <div className="flex flex-row gap-1">
                    <img src="images/sword.png" className="w-5" />
                    <span>
                        <span className="font-semibold">{combat.monster.name}</span> <span className="text-red-500 italic">{combat?.state?.last_actions?.monster.action}</span> for <span className="text-red-500 font-bold">{combat?.state?.last_actions?.monster?.amount}</span> damage!
                    </span>
                </div>}
                {combat?.state?.outcome && <>
                    {combat?.state?.outcome?.status === 'player_wins' && <div className="flex flex-row gap-1">
                        <img src="images/sword.png" className="w-5" />
                        <span>
                            <span className="font-semibold">{character.name}</span> <span className="text-green-500 italic">defeated</span> <span className="font-semibold">{combat.monster.name}</span>!
                        </span>
                    </div>}
                    {combat?.state?.outcome?.status === 'player_loses' && <div className="flex flex-row gap-1">
                        <img src="images/sword.png" className="w-5" />
                        <span>
                            <span className="font-semibold">{combat.monster.name}</span> <span className="text-red-500 italic">defeated</span> <span className="font-semibold">{character.name}</span>!
                        </span>
                    </div>}
                    {combat?.state?.outcome?.status === 'player_flees' && <div className="flex flex-row gap-1">
                        <img src="images/running.png" className="w-5" />
                        <span>
                            <span className="font-semibold">{character.name}</span> <span className="text-blue-500 italic">fled</span> from <span className="font-semibold">{combat.monster.name}</span>!
                        </span>
                    </div>}
                    {combat?.state?.outcome?.rewards && <>
                        {combat?.state?.outcome?.rewards}
                    </>}
                </>
                }
            </>}
            <div className="card card-lg border border-gray-100 shadow-md w-full lg:w-1/3">
                <div className="card-body p-3 items-center">
                    <h2 className="card-title text-center">{character.name}</h2>
                    <progress className="progress text-green-500 size-lg h-4 transition ease-in-out" value={(combat.player.health / combat.player.max_health) * 100} max="100"></progress>
                    <progress className="progress text-blue-500 size-lg h-4 transition ease-in-out" value="100" max="100"></progress>
                    <div className="flex flex-row w-full justify-between">
                        <div className="flex flex-row gap-1">
                            <img src="images/heart.png" className="w-5" />
                            <div className="font-semibold">{combat.player.health}/{combat.player.max_health}</div>
                        </div>
                        <div className="flex flex-row gap-1">
                            <img src="images/magic-wand.png" className="w-5" />
                            <div className="font-semibold">5/5</div>
                        </div>
                    </div>
                    {combat.state.outcome ?
                        <div className="w-full">
                            <button
                                className="btn btn-primary text-white w-full"
                                onClick={() => { resetCombat(); }}
                                disabled={combatLoading || resetLoading}>
                                {combatLoading || resetLoading ?
                                    <span className="loading loading-spinner loading-sm self-center"></span> :
                                    <>Return to Training Areas</>}
                            </button>
                        </div> :
                        <div className="grid grid-cols-4 w-full gap-1">
                            <button
                                className="btn btn-primary"
                                onClick={() => { updateCombat({ action: 'attack' }); }}
                                disabled={combatLoading}>
                                {combatLoading ?
                                    <span className="loading loading-spinner loading-sm self-center"></span> :
                                    <><img src="images/sword.png" className="w-5" />Attack</>}
                            </button>
                            <button
                                className="btn btn-warning"
                                onClick={() => { updateCombat({ action: 'defend' }); }}
                                disabled={combatLoading}>
                                {combatLoading ?
                                    <span className="loading loading-spinner loading-sm self-center"></span> :
                                    <><img src="images/shield.png" className="w-5" />Defend</>}
                            </button>
                            <button
                                className="btn btn-success"
                                disabled={combatLoading}
                                onClick={() => {
                                    setShowAnimation(true);
                                }}>
                                {combatLoading ?
                                    <span className="loading loading-spinner loading-sm self-center"></span> :
                                    <><img src="images/backpack.png" className="w-5" />Items</>}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => { updateCombat({ action: 'flee' }); }}
                                disabled={combatLoading}>
                                {combatLoading ?
                                    <span className="loading loading-spinner loading-sm self-center"></span> :
                                    <><img src="images/running.png" className="w-5" />Flee</>}
                            </button>
                        </div>}
                </div>
            </div>
        </div>
    );
};
export default Combat;