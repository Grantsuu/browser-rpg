import { useQuery } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { getTrainingAreas } from "../../lib/apiClient";
import { useCharacterLevels } from "../../lib/stateMangers";
import PageCard from "../../layouts/PageCard";
import ResponsiveCardGrid from "../../components/Responsive/ResponsiveCardGrid";
import ResponsiveCard from "../../components/Responsive/ResponsiveCard";
import DifficultyBadge from "../../components/Badges/DifficultyBadge";

export type TrainingArea = {
    name: string;
    description: string;
    image: string;
    required_level: number;
    difficulty: 'easy' | 'normal' | 'hard';
}

const Training = () => {
    const { data: characterLevels } = useCharacterLevels();

    const { data, error, isLoading } = useQuery({
        queryKey: ['trainingAreas'],
        queryFn: getTrainingAreas,
    });

    if (error) {
        return toast.error(`Something went wrong fetching fishing areas: ${(error as Error).message}`);
    }

    return (
        <PageCard title="Training" icon={"images/swords.png"}>
            <ResponsiveCardGrid>
                {isLoading ? <span className="loading loading-spinner loading-xl"></span>
                    : data?.map((area: TrainingArea, index: number) => (
                        <ResponsiveCard key={index} isDisabled={characterLevels?.combat_level < area?.required_level}>
                            <div className="card-body">
                                <h2 className="card-title self-center">
                                    {area?.name}
                                    <DifficultyBadge difficulty={area?.difficulty} disabled={(characterLevels?.combat_level < area?.required_level)} />
                                </h2>
                                <img src={area?.image} className="w-1/3 self-center" />
                                <button className="btn btn-primary" disabled={characterLevels?.combat_level < area?.required_level}>
                                    {(characterLevels?.combat_level < area?.required_level) ? `Required Level: ${area?.required_level}` : 'Train'}
                                </button>
                            </div>
                        </ResponsiveCard>
                    ))}
            </ResponsiveCardGrid>
        </PageCard>
    );
};
export default Training;