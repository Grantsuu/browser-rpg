import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faSeedling } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import PageCard from '../layouts/PageCard';
import FarmPlot from '../components/Farming/FarmPlot';
import { FarmPlotData } from '../types/types';
import { toast } from 'react-toastify';
import { getFarmPlots, postBuyPlot } from '../lib/apiClient';

// const MAX_PLOTS = 3;

const Farming = () => {
    const queryClient = useQueryClient();

    const { data, error, isLoading } = useQuery({
        queryKey: ['farmPlots'],
        queryFn: getFarmPlots
    });

    const { mutate, isPending } = useMutation({
        mutationFn: () => postBuyPlot(),
        onSuccess: () => {
            toast.success(`Plot bought succesfully!`);
            queryClient.invalidateQueries({ queryKey: ['farmPlots'] });
            queryClient.invalidateQueries({ queryKey: ['character'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to buy plot: ${(error as Error).message}`);
        }
    });

    if (isLoading) return <span className="loading loading-spinner loading-sm"></span>;

    if (error) {
        return toast.error(`Something went wrong fetching farm plots: ${(error as Error).message}`);
    }

    return (
        <PageCard title="Farming" icon={faSeedling}>
            <div className="grid grid-cols-3 gap-4">
                {/* Render active farm plots */}
                {data.map((plot: FarmPlotData, index: number) => {
                    return (
                        <FarmPlot key={index} plotData={plot} />
                    )
                })}
                <div className="card w-full bg-base-100 card-lg shadow-sm">
                    <div className="card-body items-center justify-between">
                        <div></div>
                        <div className="prose">
                            <h1>
                                500 <FontAwesomeIcon icon={faCoins as IconProp} />
                            </h1>
                        </div>
                        <button className="btn btn-primary btn-wide" onClick={() => mutate()} disabled={isPending}>
                            {isPending ? <span className="loading loading-spinner loading-sm"></span> : 'Buy new plot'}
                        </button>
                    </div>
                </div>
            </div>
        </PageCard>
    )
}

export default Farming;