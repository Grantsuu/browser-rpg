import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faRotateRight, faSeedling, faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { Crop, FarmPlotData } from "../../types/types";
import { putClearPlot, postHarvestPlot, postPlantPlot, getCrops } from '../../lib/apiClient';
import { useConfetti } from '../../contexts/ConfettiContext';
import { useTimers } from '../../contexts/TimersContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCharacter } from '../../lib/stateMangers';
import SuccessToast from '../Toasts/SuccessToast';
import LevelUpToast from '../Toasts/LevelUpToast';

interface FarmPlotProps {
    plotData: FarmPlotData;
}

const FarmPlot = ({ plotData }: FarmPlotProps) => {
    const queryClient = useQueryClient();
    const { levelUpConfetti } = useConfetti();
    const { data: character } = useCharacter();
    const { createTimer, removeTimer } = useTimers();

    const [status, setStatus] = useState('Inactive');
    const [progress, setProgress] = useState(0);
    const [seedDrawerOpen, setSeedDrawerOpen] = useState(false);

    useEffect(() => {
        const time = new Date().toLocaleString();
        const plotEndTime = plotData.end_time ? parseISO(plotData.end_time).toLocaleString() : '';
        setStatus((plotData.crop === null) ? 'Inactive' : (plotEndTime > time) ? 'Growing' : 'Ready to Harvest');
    }, [plotData]);

    useEffect(() => {
        if (status === 'Inactive') {
            setProgress(0);
        } else if (status === 'Growing') {
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

    const { data: cropData, error: cropError, isLoading: cropIsLoading } = useQuery({
        queryKey: ['crops'],
        queryFn: getCrops
    });

    const { mutate: plantSeeds, isPending: isPlantSeedsPending } = useMutation({
        mutationFn: (variables: { plotId: number, crop: Crop }) => postPlantPlot(variables.plotId, variables.crop.seed.id),
        onSuccess: (_, variables) => {
            // toast.success(`Planted ${variables.crop.seed.name}!`);
            queryClient.invalidateQueries({ queryKey: ['farmPlots'] });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            // Set a timer to notify the user when the crop is ready to harvest if they're not on the farming page
            createTimer(plotData.id.toString(), () => {
                if (window.location.pathname !== '/farming') {
                    toast.info(
                        <div className="flex flex-row w-full items-center justify-center gap-1">
                            <div>
                                Your {variables.crop.product.name} is ready to harvest!
                                Click <Link to='/farming' className="text-blue-500 hover:text-blue-800 underline">here</Link> to go to the Farming page.
                            </div>
                            <div className="w-1/3">
                                <img src={variables.crop.product.image.base64} alt={variables.crop.product.image.alt} title={variables.crop.product.image.alt} />
                            </div>
                        </div>);
                }
            }, variables.crop.grow_time * 1000);
        },
        onError: (error: Error) => {
            toast.error(`Failed to plant seeds: ${(error as Error).message}`);
        }
    });

    const { mutate: clearFarmPlot, isPending: isDeletePlotPending } = useMutation({
        mutationFn: (plotId: number) => putClearPlot(plotId),
        onSuccess: () => {
            removeTimer(plotData.id.toString());
            toast.success('Cancelled plot successfully!');
            setProgress(0);
            queryClient.invalidateQueries({ queryKey: ['farmPlots'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to cancel plot: ${(error as Error).message}`);
        }
    });

    const { mutate: harvest, isPending: isHarvestPending } = useMutation({
        mutationFn: (plotId: number) => postHarvestPlot(plotId),
        onSuccess: (data) => {
            toast.success(
                <SuccessToast
                    action="Harvested"
                    name={plotData.crop.product.name}
                    amount={data.amount}
                    experience={plotData.crop.experience}
                    image={plotData.crop.product.image}
                />);
            if (data.level) {
                levelUpConfetti();
                toast.info(
                    <LevelUpToast
                        level={data.level}
                        skill="Farming"
                    />);
            }
            queryClient.invalidateQueries({ queryKey: ['farmPlots'] });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['character'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to harvest crop: ${(error as Error).message}`);
        }
    });

    const handlePlantSeed = (plotId: number, crop: Crop) => {
        plantSeeds({ plotId, crop });
        setSeedDrawerOpen(false);
    }

    return (
        <div>
            <div className="card border border-gray-200 w-full h-full aspect-square xl:aspect-auto bg-base-100 card-lg shadow-md">
                <div className="card-body justify-between">
                    <div className="flex w-full items-center justify-center">
                        <h2 className="card-title text-center">Farm Plot</h2>
                    </div>
                    <div className="flex justify-center">
                        {status === 'Inactive' ?
                            <FontAwesomeIcon icon={faSeedling as IconProp} size="3x" color="green" /> :
                            <img
                                src={plotData.crop && (status === 'Growing' ? plotData.crop.seed.image.base64 : plotData.crop.product.image.base64)}
                                alt={plotData.crop && (status === 'Growing' ? plotData.crop.seed.image.alt : plotData.crop.product.image.alt)}
                                title={plotData.crop && (status === 'Growing' ? plotData.crop.seed.image.alt : plotData.crop.product.image.alt)}
                                className="w-15"
                            />}
                    </div>
                    <div className="prose">
                        <div><b>Status:</b> {status}</div>
                        <div><b>Contents:</b> {plotData.crop ? plotData.crop.seed.name : 'None'}</div>
                        <div><b>Previous Crop:</b> {plotData.previous_crop ? plotData.previous_crop.seed.name : 'None'}</div>
                        <div className="flex flew-row items-baseline gap-2">
                            <div><b>Progress:</b></div>
                            <progress className="progress progress-success w-full" value={progress} max="100"></progress>
                        </div>
                    </div>
                    <div className="card-actions justify-center">
                        {status === 'Inactive' &&
                            <div className="flex flex-row gap-1 justify-center">
                                {/* TODO: Add a tool tip when hovering this button to explain what it does */}
                                {plotData.previous_crop && <button className="btn btn-outline btn-primary btn-square btn-lg lg:btn-md" onClick={() => handlePlantSeed(plotData.id, plotData.previous_crop)} disabled={isPlantSeedsPending}>
                                    {isPlantSeedsPending ? <span className="loading loading-spinner loading-xl"></span> : <FontAwesomeIcon icon={faRotateRight as IconProp} />}
                                </button>}
                                <button className="btn btn-primary btn-wide btn-lg lg:btn-md" onClick={() => setSeedDrawerOpen(true)} disabled={isPlantSeedsPending}>
                                    {isPlantSeedsPending ? <span className="loading loading-spinner loading-xl"></span> : 'Plant Seeds'}
                                </button>

                            </div>
                        }
                        {status === 'Growing' &&
                            <button className="btn btn-secondary btn-wide btn-lg lg:btn-md" onClick={() => clearFarmPlot(plotData.id)} disabled={isDeletePlotPending}>
                                {isDeletePlotPending ? <span className="loading loading-spinner loading-xl"></span> : 'Cancel'}
                            </button>}
                        {status === 'Ready to Harvest' &&
                            <button className="btn btn-success btn-wide btn-lg lg:btn-md" onClick={() => (harvest(plotData.id))} disabled={isHarvestPending}>
                                {isHarvestPending ? <span className="loading loading-spinner loading-xl"></span> : 'Harvest'}
                            </button>
                        }
                    </div>
                </div>
            </div>
            {/* Seed Drawer */}
            <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" checked={seedDrawerOpen} onChange={() => { }} />
                <div className="drawer-side z-1">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay" onClick={() => setSeedDrawerOpen(false)} />
                    <ul className="menu bg-base-200 text-base-content h-full w-85 lg:w-1/3 p-4 overflow-y-scroll">
                        {/* Sidebar content here */}
                        <div className="flex items-start justify-between prose">
                            <h2 className="flex-1 text-center">Choose a Seed</h2>
                            <button className="btn btn-circle btn-ghost" onClick={() => setSeedDrawerOpen(false)}><FontAwesomeIcon icon={faXmark as IconProp} /></button>
                        </div>
                        <div className="flex flex-center">
                            {
                                cropIsLoading ?
                                    <span className="loading loading-spinner loading-xl"></span> :
                                    cropError ?
                                        <div>
                                            <p>Error loading crops: {cropError?.message}</p>
                                        </div> :
                                        <div className="flex flex-col gap-2 w-full">
                                            {cropData?.sort((a: Crop, b: Crop) => a.required_level - b.required_level).map((crop: Crop) => (
                                                <div key={crop?.id} className="card card-md w-full bg-base-100 shadow-md">
                                                    <div className="card-body">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex flex-row gap-2 items-center">
                                                                <img src={crop?.seed?.image.base64} alt={crop?.seed?.image?.alt} title={crop?.seed?.image?.alt} className="w-10" />
                                                                <div><b>Lvl. {crop?.required_level}</b></div>
                                                                <div>{crop?.seed?.name}</div>
                                                            </div>
                                                            <button className="btn btn-primary" onClick={() => handlePlantSeed(plotData.id, crop)} disabled={isPlantSeedsPending || (character?.farming_level < crop?.required_level)}>Plant</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                            }
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FarmPlot;