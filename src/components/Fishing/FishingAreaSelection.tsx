import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from 'react-toastify';
import { FishingScreen } from "../../containers/Fishing";
import { getFishingAreas } from "../../lib/apiClient";
import { type FishingArea } from "../../types/types";

interface FishingAreaSelectionProps {
    setDisplay: (display: FishingScreen) => void;
    setArea: (area: string) => void;
    setDisableTiles: (disable: boolean) => void;
    startFishing: () => Promise<void>;
}

const FishingAreaSelection = ({ setDisplay, setArea, setDisableTiles, startFishing }: FishingAreaSelectionProps) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['fishingAreas'],
        queryFn: () => getFishingAreas(),
    });

    if (error) {
        return toast.error(`Something went wrong fetching fishing areas: ${(error as Error).message}`);
    }

    const handleSelectArea = async (area: FishingArea) => {
        setDisplay('Fishing');
        setArea(area.name);
        setDisableTiles(true);
        await startFishing();
        setDisableTiles(false);
    }

    return (
        <div>
            {isLoading ? (
                <span className="loading loading-spinner loading-xl"></span>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {data.map((area: FishingArea, index: number) => (
                        <div key={index} className="card border border-gray-300 shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer" onClick={() => handleSelectArea(area)}>
                            <div className="card-body text-center items-center">
                                <h2 className="text-xl font-semibold"><FontAwesomeIcon icon={faWater as IconProp} className="text-blue-500" /> {area.name}</h2>
                                <p className="text-sm text-gray-700"><div className="flex flex-row gap-1">Required Level: <div className="font-medium"><i>{area.required_level}</i></div></div></p>
                                <p className="text-sm text-gray-700"><div className="flex flex-row gap-1">Size: <div className="font-medium"><i>{area.size}</i></div></div></p>
                                <p>{area.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FishingAreaSelection;