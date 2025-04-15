import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import type { Monster } from "../../types/types";
import { getMonstersByArea, getTrainingAreas, getCombatByCharacterId, putUpdateCombat } from "../../lib/apiClient";
import { useCharacterLevels } from "../../lib/stateMangers";
import PageCard from "../../layouts/PageCard";
import ResponsiveCardGrid from "../../components/Responsive/ResponsiveCardGrid";
import ResponsiveCard from "../../components/Responsive/ResponsiveCard";
import DifficultyBadge from "../../components/Badges/DifficultyBadge";
import Combat from "../Combat/Combat";

export type TrainingArea = {
    name: string;
    description: string;
    image: string;
    required_level: number;
    difficulty: 'easy' | 'normal' | 'hard';
}

const Training = () => {
    const queryClient = useQueryClient();
    const { data: characterLevels, isLoading: levelsLoading } = useCharacterLevels();

    const [monsterSelectOpen, setMonsterSelectOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState<TrainingArea | undefined>(undefined);

    const { data: areas, error: areasError, isLoading: areasLoading } = useQuery({
        queryKey: ['trainingAreas'],
        queryFn: getTrainingAreas,
    });

    const { data: monsters, error: monstersError, isLoading: monstersLoading } = useQuery({
        queryKey: ['monsters'],
        queryFn: () => getMonstersByArea(selectedArea ? selectedArea.name : ''),
        enabled: monsterSelectOpen,
    });

    const { data: combatData, error: combatError, isLoading: combatLoading } = useQuery({
        queryKey: ['combat'],
        queryFn: getCombatByCharacterId,
    });

    const { mutate: updateCombat } = useMutation({
        mutationFn: (variables: { action: string, monsterId?: number }) => putUpdateCombat(variables.action, variables.monsterId),
        onSuccess: (data) => {
            queryClient.setQueryData(['combat'], data);
        },
        onError: (error) => {
            toast.error(`Something went wrong starting combat: ${(error as Error).message}`);
        }
    });

    const handleSelectArea = (area: TrainingArea) => {
        setSelectedArea(area);
        setMonsterSelectOpen(true);
    }

    const handleSelectMonster = (monster: Monster) => {
        updateCombat({ action: 'start', monsterId: monster.id });
        setMonsterSelectOpen(false);
    }

    if (areasError) {
        return toast.error(`Something went wrong fetching training areas: ${(areasError as Error).message}`);
    }

    if (combatError) {
        toast.error(`Something went wrong fetching combat data: ${(combatError as Error).message}`);
    }

    if (monstersError) {
        toast.error(`Something went wrong fetching monsters: ${(monstersError as Error).message}`);
    }

    return (
        <PageCard title="Training" icon={"images/swords.png"}>
            {(areasLoading || levelsLoading || combatLoading) ?
                <span className="h-full loading loading-spinner loading-xl self-center"></span> :
                combatData?.monster ?
                    <Combat combat={combatData} /> :
                    <ResponsiveCardGrid>
                        {areas?.map((area: TrainingArea, index: number) => (
                            <ResponsiveCard key={index} isDisabled={characterLevels?.combat_level < area?.required_level}>
                                <div className="card-body">
                                    <h2 className="card-title self-center">
                                        {area?.name}
                                        <DifficultyBadge difficulty={area?.difficulty} disabled={(characterLevels?.combat_level < area?.required_level)} />
                                    </h2>
                                    <img src={area?.image} alt={area?.name} title={area?.name} className="w-1/3 self-center" />
                                    <button className="btn btn-primary" onClick={() => handleSelectArea(area)} disabled={characterLevels?.combat_level < area?.required_level}>
                                        {(characterLevels?.combat_level < area?.required_level) ? `Required Level: ${area?.required_level}` : 'Train'}
                                    </button>
                                </div>
                            </ResponsiveCard>
                        ))}
                    </ResponsiveCardGrid>}
            <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" checked={monsterSelectOpen} onChange={() => { }} />
                <div className="drawer-side z-2">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay" onClick={() => setMonsterSelectOpen(false)} />
                    <ul className="menu bg-base-200 text-base-content h-full w-85 lg:w-1/3 p-4 overflow-y-scroll">
                        <div className="flex flex-col h-full">
                            {/* Sidebar content here */}
                            <div className="flex items-start justify-between prose">
                                <h2 className="flex-1 text-center">Farmstead</h2>
                                <button className="btn btn-circle btn-ghost" onClick={() => setMonsterSelectOpen(false)}><FontAwesomeIcon icon={faXmark as IconProp} /></button>
                            </div>
                            <div className="flex flex-col gap-2 h-full">
                                {monstersLoading ? <span className="h-full loading loading-spinner loading-xl self-center"></span> :
                                    monstersError ? <span className="h-full text-center">Something went wrong fetching monsters: {(monstersError as Error).message}</span> :
                                        monsters?.map((monster: Monster, index: number) => {
                                            return (
                                                <div key={index} className="card w-full bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex flex-row w-full gap-3 items-center">
                                                                <img src={monster.image} alt={monster.name} className="w-1/6" />
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="text-lg font-bold">{monster.name}</div>
                                                                    <div className="text-base">Combat Level {monster.level}</div>
                                                                    <div className="flex flex-row text-base gap-1"><img src="images/heart.png" className="w-5" />{monster.health}</div>
                                                                </div>
                                                            </div>
                                                            <button className="btn btn-secondary" onClick={() => handleSelectMonster(monster)}>Fight</button>
                                                        </div>
                                                    </div>
                                                </div>)
                                        })
                                }
                            </div>
                        </div>
                    </ul>
                </div>
            </div >
        </PageCard >
    );
};
export default Training;