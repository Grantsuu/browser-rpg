import { useEffect, useState } from 'react';
import { parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { FarmPlotData } from "../../types/types";
import { deletePlot, postHarvestPlot, postPlantPlot } from '../../lib/apiClient';
import { useConfetti } from '../../contexts/ConfettiContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface FarmPlotProps {
    plotData: FarmPlotData;
}

const FarmPlot = ({ plotData }: FarmPlotProps) => {
    const queryClient = useQueryClient();
    const { startConfetti, stopConfetti } = useConfetti();
    const [status, setStatus] = useState('Inactive');

    const handleConfetti = () => {
        startConfetti();
        setTimeout(() => {
            stopConfetti();
        }, 10000);
    }

    useEffect(() => {
        const time = new Date().toLocaleString();
        const plotEndTime = plotData.end_time ? parseISO(plotData.end_time).toLocaleString() : '';
        // console.log('time', time);
        // console.log('plot end time', plotEndTime);
        setStatus((Object.values(plotData).length === 0) ? 'Inactive' : (plotEndTime > time) ? 'Growing' : 'Ready to Harvest');
    }, [plotData]);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (status === 'Growing') {
            const startTime = parseISO(plotData.start_time);
            const endTime = parseISO(plotData.end_time);
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const elapsedTime = now - startTime.getTime();
                const percentage = (elapsedTime / (endTime.getTime() - startTime.getTime())) * 100;
                setProgress(percentage);
                if (percentage >= 100) {
                    clearInterval(interval);
                    setStatus('Ready to Harvest');
                    queryClient.invalidateQueries({ queryKey: ['farmPlots'] });
                }
            }, 100);

            return () => clearInterval(interval);
        } else if (status === 'Ready to Harvest') {
            setProgress(100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const { mutate: plantSeeds, isPending: isPlantSeedsPending } = useMutation({
        mutationFn: (seedId: number) => postPlantPlot(seedId),
        onSuccess: () => {
            toast.success('Planted 1x Wheat Seeds!');
            queryClient.invalidateQueries({ queryKey: ['farmPlots'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to plant seeds: ${(error as Error).message}`);
        }
    });

    const { mutate: deleteFarmPlot, isPending: isDeletePlotPending } = useMutation({
        mutationFn: (plotId: number) => deletePlot(plotId),
        onSuccess: () => {
            toast.success('Deleted plot!');
            queryClient.invalidateQueries({ queryKey: ['farmPlots'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete plot: ${(error as Error).message}`);
        }
    });

    const { mutate: harvest, isPending: isHarvestPending } = useMutation({
        mutationFn: (plotId: number) => postHarvestPlot(plotId),
        onSuccess: (data) => {
            toast.success(`Harvested ${data.amount}x ${plotData.crop.product.name}!`);
            toast.info(`Gained ${plotData.crop.experience} farming experience!`);
            if (data.level > 0) {
                handleConfetti();
                toast.success(`Congratulations! You've reached level ${data.level} Farming!`);
            }
            queryClient.invalidateQueries({ queryKey: ['farmPlots'] });
            queryClient.invalidateQueries({ queryKey: ['character'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to harvest crop: ${(error as Error).message}`);
        }
    });

    return (
        <div className="card w-full bg-base-100 card-lg shadow-sm">
            <div className="card-body">
                <div className="flex w-full items-center justify-center">
                    <h2 className="card-title text-center">Farm Plot</h2>
                </div>
                <div className="flex justify-center">
                    {status === 'Inactive' ? <FontAwesomeIcon icon={faSeedling as IconProp} size="3x" color="green" /> : <img src={plotData.crop && (status === 'Growing' ? plotData.crop.seed.image.base64 : plotData.crop.product.image.base64)} alt="crop" className="w-15" />}
                </div>
                <div className="prose">
                    <div><b>Status:</b> {status}</div>
                    <div><b>Contents:</b> {plotData.crop ? plotData.crop.seed.name : 'None'}</div>
                    <div className="flex flew-row items-baseline gap-2">
                        <div><b>Progress:</b></div>
                        <progress className="progress progress-success w-full" value={progress} max="100"></progress>
                    </div>
                </div>
                <div className="justify-center card-actions">
                    {status === 'Inactive' &&
                        <button className="btn btn-primary btn-wide" onClick={() => plantSeeds(9)} disabled={isPlantSeedsPending}>
                            {isPlantSeedsPending ? <span className="loading loading-spinner loading-xl"></span> : 'Plant Seeds'}
                        </button>
                    }
                    {status === 'Growing' &&
                        <button className="btn btn-secondary btn-wide" onClick={() => deleteFarmPlot(plotData.id)} disabled={isDeletePlotPending}>
                            {isDeletePlotPending ? <span className="loading loading-spinner loading-xl"></span> : 'Cancel'}
                        </button>}
                    {status === 'Ready to Harvest' &&
                        <button className="btn btn-success btn-wide" onClick={() => (harvest(plotData.id))} disabled={isHarvestPending}>
                            {isHarvestPending ? <span className="loading loading-spinner loading-xl"></span> : 'Harvest'}
                        </button>
                    }
                </div>
            </div>
        </div >
    );
};

export default FarmPlot;