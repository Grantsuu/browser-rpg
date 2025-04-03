import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExclamation, faFish, faFishFins, faHashtag, faRotateLeft, faWater, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from 'react-toastify';
import { getFishingGame, postStartFishingGame } from '../lib/apiClient';
import PageCard from '../layouts/PageCard';
import FishingTile from "../components/Fishing/FishingTile";
import FishingAreaSelection from '../components/Fishing/FishingAreaSelection';

export type FishingScreen = 'AreaSelection' | 'Fishing';

const Farming = () => {
    const queryClient = useQueryClient();

    // Controls which screen to display
    // AreaSelection: Select the area to fish in
    // Fishing: The fishing game board
    const [display, setDisplay] = useState<FishingScreen>('AreaSelection');
    const [area, setArea] = useState<string>('');

    const [disableTiles, setDisableTiles] = useState(false);

    const { data, error, isLoading } = useQuery({
        queryKey: ['fishing'],
        queryFn: () => getFishingGame(),
    });

    const { mutateAsync: startFishing, isPending: isStarting } = useMutation({
        mutationFn: () => postStartFishingGame(area),
        onSuccess: () => {
            // toast.success(`Fishing game started!`);
            setDisableTiles(false);
            queryClient.invalidateQueries({ queryKey: ['fishing'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to start fishing game: ${(error as Error).message}`);
        }
    });

    useEffect(() => {
        if (data?.game_state) {
            setDisplay('Fishing');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) return <span className="loading loading-spinner loading-xl"></span>;

    if (error) {
        return toast.error(`Something went wrong fetching farm plots: ${(error as Error).message}`);
    };

    const handleReset = async () => {
        setDisableTiles(true);
        await startFishing();
        setDisableTiles(false);
    };

    return (
        <PageCard title="Fishing" icon={faFish}>
            {/* Area Selection Screen */}
            {display === 'AreaSelection' ?
                <div>
                    <FishingAreaSelection setDisplay={setDisplay} setArea={setArea} setDisableTiles={setDisableTiles} startFishing={startFishing} />
                </div>
                // Fishing Game Board
                : <div>
                    {/* Info */}
                    <div className="flex flex-col w-full text-center items-center justify-between lg:mb-4">
                        <div className="flex flex-row items-center gap-2 text-2xl font-bold">
                            <FontAwesomeIcon icon={faWater as IconProp} />
                            {data?.area?.name}
                        </div>
                        <div className="flex flex-col mb-2 items-center">
                            {data?.game_state ?
                                <div className="flex grid grid-cols-3 items-end justify-center gap-4">
                                    <button className="btn btn-primary" onClick={() => setDisplay('AreaSelection')}><FontAwesomeIcon icon={faArrowLeft as IconProp} /><div className="hidden sm:inline-block">Select Area</div></button>
                                    {isStarting ? <span className="justify-center loading loading-spinner loading-xl"></span> : <div className="">
                                        <div className="text-lg">Attempts Left</div>
                                        {/* TODO: Changed color based on number of attempts left */}
                                        <div className={`text-4xl md:text-5xl ${data.turns > 4 ? "text-red-500" : data.turns > 2 ? "text-yellow-500" : "text-blue-500"}`}>
                                            {data?.area.max_turns - data.turns}/{data?.area.max_turns}
                                        </div>
                                    </div>}
                                    <button className="btn btn-secondary" onClick={() => { handleReset() }} disabled={isStarting}>{isStarting ? <span className="loading loading-spinner loading-sm"></span> : <><FontAwesomeIcon icon={faRotateLeft as IconProp} /><div className="hidden sm:inline-block">Reset</div></>}</button>
                                </div> :
                                <button className="btn btn-primary btn-wide" onClick={() => { startFishing() }}>
                                    Start Fishing
                                </button>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col justify-around sm:flex-row gap-1 md:gap-2">
                        {/* Fishing Board */}
                        <div className="relative w-full sm:w-1/2 lg:w-1/2 xl:w-1/4">
                            <div className="grid grid-cols-3 gap-1">
                                <FishingTile label={faFishFins} disabled={disableTiles} setDisabled={setDisableTiles} />
                                <FishingTile label="3" disabled={disableTiles} setDisabled={setDisableTiles} />
                                <FishingTile label={faFishFins} disabled={disableTiles} setDisabled={setDisableTiles} />
                                <FishingTile label="2" disabled={disableTiles} setDisabled={setDisableTiles} />
                                <FishingTile label={faFishFins} disabled={disableTiles} setDisabled={setDisableTiles} />
                                <FishingTile label="3" disabled={disableTiles} setDisabled={setDisableTiles} />
                                <FishingTile label="1" disabled={disableTiles} setDisabled={setDisableTiles} />
                                <FishingTile label="2" disabled={disableTiles} setDisabled={setDisableTiles} />
                                <FishingTile label={faExclamation} disabled={disableTiles} setDisabled={setDisableTiles} />
                            </div>
                            <div className={`invisible absolute bg-gray-700/75 bottom-0 left-0 w-full h-full rounded-xl transition-all ease-in-out duration-300 ${data?.turns === 5 ? "visible opacity-100" : "opacity-0"}`}>
                                <div className="flex flex-col items-center justify-center h-full gap-2">
                                    <button className="btn btn-primary btn-lg" onClick={() => setDisplay('AreaSelection')}><FontAwesomeIcon icon={faArrowLeft as IconProp} />Select Area</button>
                                    <button className="btn btn-secondary btn-lg" onClick={() => { handleReset() }} disabled={isStarting}>{isStarting ? <span className="loading loading-spinner loading-sm"></span> : <><FontAwesomeIcon icon={faRotateLeft as IconProp} />New Game</>}</button>
                                </div>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="w-full sm:w-1/2 lg:w-1/3 items-center">
                            <div className="flex flex-row items-center justify-center gap-2 text-xl font-bold">
                                <FontAwesomeIcon icon={faQuestion as IconProp} className="text-sm aspect-square border-2 rounded-full p-1" />
                                Legend
                            </div>
                            <table className="table md:table-sm lg:table-sm xl:table-md text-center">
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Meaning</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><FontAwesomeIcon icon={faQuestion as IconProp} /></td>
                                        <td>Undiscovered</td>
                                    </tr>
                                    <tr>
                                        <td><FontAwesomeIcon icon={faHashtag as IconProp} className="aspect-square border-2 p-1" /></td>
                                        <td>Adjacent Unempty Tiles</td>
                                    </tr>
                                    <tr>
                                        <td><FontAwesomeIcon icon={faFishFins as IconProp} className="border-2 rounded-full p-1" /></td>
                                        <td>Fish</td>
                                    </tr>
                                    <tr>
                                        <td className="text-yellow-400"><FontAwesomeIcon icon={faFishFins as IconProp} className="border-2 rounded-full p-1" /></td>
                                        <td>Bountiful Fish</td>
                                    </tr>
                                    <tr>
                                        <td className="text-yellow-400"><FontAwesomeIcon icon={faExclamation as IconProp} className="aspect-square border-2 rounded-full p-1" /></td>
                                        <td>Random Event</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>}
        </PageCard >
    )
}

export default Farming;