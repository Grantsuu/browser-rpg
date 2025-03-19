import { useQuery } from '@tanstack/react-query';
import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import PageCard from '../layouts/PageCard';
import FarmPlot from '../components/Farming/FarmPlot';
import { FarmPlotData } from '../types/types';
import { toast } from 'react-toastify';
import { getFarmPlots } from '../lib/apiClient';

const MAX_PLOTS = 3;

const Farming = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['farmPlots'],
        queryFn: getFarmPlots
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
                {/* Render inactive farm plots */}
                {[...Array(MAX_PLOTS - data.length)].map((_, index) => {
                    return (
                        <FarmPlot key={index} plotData={{} as FarmPlotData} />
                    )
                })}
            </div>
        </PageCard>
    )
}

export default Farming;