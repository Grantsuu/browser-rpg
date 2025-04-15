import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import type { CombatData, Monster } from "../../types/types";
import { useCharacter } from "../../lib/stateMangers";
import { putUpdateCombat } from "../../lib/apiClient";

interface CombatProps {
    monster: Monster;
}

const Combat = ({ monster }: CombatProps) => {
    const queryClient = useQueryClient();
    const { data: character } = useCharacter();

    const { mutateAsync: updateCombat, isPending: combatLoading } = useMutation({
        mutationFn: (variables: { action: string, monsterId?: number }) => putUpdateCombat(variables.action, variables.monsterId),
        onSuccess: (data) => {
            queryClient.setQueryData(['combat'], (oldData: CombatData) => {
                return {
                    ...oldData,
                    monster: data.monster
                };
            })
        },
        onError: (error) => {
            toast.error(`Something went wrong starting combat: ${(error as Error).message}`);
        }
    });

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="card card-lg border border-gray-100 shadow-md w-full lg:w-1/3">
                <div className="card-body p-3 items-center">
                    <h2 className="card-title text-center">{monster.name}</h2>
                    <img src={monster.image} alt={monster.name} title={monster.name} className="w-1/3" />
                    <div className="flex flex-row gap-1">
                        <img src="images/heart.png" className="w-5" />
                        <div className="font-semibold">{monster.health}/{monster.health}</div>
                    </div>
                    <div className="flex flex-row gap-1">
                        <progress className="progress progress-error size-lg w-90 h-4 transition ease-in-out" value="50" max="100"></progress>
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-1"><img src="images/sword.png" className="w-5" /><span><span className="font-semibold">{monster.name}</span> <span className="text-red-500 italic">attacks</span> for <span className="text-red-500 font-bold">1</span> damage!</span></div>
            <div className="flex flex-row gap-1"><img src="images/sword.png" className="w-5" /><span><span className="font-semibold">{character.name}</span> <span className="text-red-500 italic">attacks</span> for <span className="text-red-500 font-bold">99</span> damage!</span></div>
            <div className="card card-lg border border-gray-100 shadow-md w-full lg:w-1/3">
                <div className="card-body p-3 items-center">
                    <h2 className="card-title text-center">{character.name}</h2>
                    <progress className="progress text-green-500 size-lg h-4 transition ease-in-out" value="100" max="100"></progress>
                    <progress className="progress text-blue-500 size-lg h-4 transition ease-in-out" value="100" max="100"></progress>
                    <div className="flex flex-row w-full justify-between">
                        <div className="flex flex-row gap-1">
                            <img src="images/heart.png" className="w-5" />
                            <div className="font-semibold">10/10</div>
                        </div>
                        <div className="flex flex-row gap-1">
                            <img src="images/magic-wand.png" className="w-5" />
                            <div className="font-semibold">5/5</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 w-full gap-1">
                        <button
                            className="btn btn-primary"
                            disabled={combatLoading}>
                            {combatLoading ?
                                <span className="loading loading-spinner loading-sm self-center"></span> :
                                <><img src="images/sword.png" className="w-5" />Attack</>}
                        </button>
                        <button
                            className="btn btn-warning"
                            disabled={combatLoading}>
                            {combatLoading ?
                                <span className="loading loading-spinner loading-sm self-center"></span> :
                                <><img src="images/shield.png" className="w-5" />Defend</>}
                        </button>
                        <button
                            className="btn btn-success"
                            disabled={combatLoading}>
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
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Combat;