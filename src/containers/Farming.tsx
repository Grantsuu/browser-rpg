import { useState, useEffect } from 'react';
import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import PageCard from '../layouts/PageCard';
import FarmPlot from '../components/Farming/FarmPlot';
import { FarmPlotData } from '../types/types';
import { toast } from 'react-toastify';
import { getFarmPlots } from '../lib/api-client';

// const MAX_PLOTS = 3;

const Farming = () => {
    const [loading, setLoading] = useState(false);

    const [plots, setPlots] = useState([0, 0, 0]);

    const handleGetFarmPlots = async () => {
        setLoading(true);
        try {
            const farmPlots = await getFarmPlots();
            setPlots(farmPlots);
        } catch (error) {
            console.log(error);
            toast.error(`Something went wrong fetching farm plots: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetFarmPlots();
    }, []);

    return (
        <PageCard title="Farming" icon={faSeedling}>
            <div className="grid grid-cols-3 gap-4">
                {loading ? <span className="loading loading-spinner loading-sm"></span> :
                    plots.map((index) => {
                        return (
                            <FarmPlot key={index} plotData={{} as FarmPlotData} />
                        )
                    })
                }
            </div>
        </PageCard>
    )
}

export default Farming;