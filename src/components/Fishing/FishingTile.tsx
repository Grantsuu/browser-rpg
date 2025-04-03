import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from 'react-toastify';
import { putUpdateFishingGame } from '../../lib/apiClient';

interface FishingTileProps {
    label: string | IconProp;
    color?: string;
    disabled: boolean;
    setDisabled: (disable: boolean) => void;
}

const FishingTile = ({ label, color, disabled, setDisabled }: FishingTileProps) => {
    const queryClient = useQueryClient();
    const [isDiscovered, setIsDiscovered] = useState(false);

    const { mutateAsync: updateFishing, isPending } = useMutation({
        mutationFn: async () => putUpdateFishingGame(),
        onSuccess: (data) => {
            toast.success(`Fishing game updated!`);
            setIsDiscovered(true);
            queryClient.invalidateQueries({ queryKey: ['fishing'] });
            if (data.turns < 5) {
                setDisabled(false);
            }
        },
        onError: (error: Error) => {
            toast.error(`Failed to update fishing game: ${(error as Error).message}`);
        }
    });

    const handleClick = async () => {
        if (disabled || isDiscovered) return;
        setDisabled(true);
        await updateFishing();
    }

    return (
        <div onClick={() => { handleClick() }} className={`card w-full aspect-square bg-blue-500 border-blue-700 shadow-sm border-r-4 border-b-4 ${isDiscovered ? "" : "hover:bg-blue-400 hover:border-blue-500 transition-all duration-300 ease-in-out"} ${disabled || isDiscovered ? "" : "cursor-pointer"} ${disabled && !isPending && !isDiscovered ? "pointer-events-none bg-gray-500 border-gray-700" : ""}`}>
            <div className={`card-body justify-center items-center text-2xl xs:text-3xl xl:text-4xl font-semibold ${isDiscovered && color ? color : "text-white"}`}>
                {/* If tile is not yet discovered display a '?' */}
                {isPending ? (
                    <span className="loading loading-spinner loading-xl"></span>
                ) : !isDiscovered ? (
                    <FontAwesomeIcon icon={faQuestion as IconProp} />
                ) : typeof (label) === "string" ? (
                    <div className="aspect-square border-4 text-center">
                        {label}
                    </div>
                ) : (
                    <div className="aspect-square border-4 rounded-full p-1 text-center">
                        <FontAwesomeIcon icon={label as IconProp} />
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default FishingTile;