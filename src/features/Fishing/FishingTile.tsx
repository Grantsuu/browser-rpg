import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFish, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from 'react-toastify';
import { clsx } from 'clsx';
import { useConfetti } from '@contexts/ConfettiContext';
import { putUpdateFishingGame } from '@lib/apiClient';
import SuccessToast from '@components/Toasts/SuccessToast';
import LevelUpToast from '@components/Toasts/LevelUpToast';

interface FishingTileProps {
    label: string;
    row: number;
    col: number;
    disabled: boolean;
    setDisabled: (disable: boolean) => void;
}

const FishingTile = ({ label, row, col, disabled, setDisabled }: FishingTileProps) => {
    const queryClient = useQueryClient();
    const { levelUpConfetti } = useConfetti();
    const [isDiscovered, setIsDiscovered] = useState(false);
    const [tileLabel, setTileLabel] = useState(label);

    const { mutateAsync: updateFishing, isPending } = useMutation({
        mutationFn: async () => putUpdateFishingGame(row, col),
        onSuccess: (data) => {
            if (data.fish && data.experience) {
                toast.success(
                    <SuccessToast
                        action="Caught"
                        name={data.fish.name}
                        amount={data.fish_amount}
                        experience={data.experience}
                        image={data.fish.item.image}
                    />);
            }
            if (data.level) {
                levelUpConfetti();
                toast.info(
                    <LevelUpToast
                        level={data.level}
                        skill="Fishing"
                    />);
            }
            setIsDiscovered(true);
            queryClient.setQueryData(['fishing'], data);
            if (data.turns < data.area.max_turns) {
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
        setTileLabel("loading");
        await updateFishing();
    };

    const determineLabel = (label: string) => {
        switch (label) {
            case "loading":
                return <span className="loading loading-spinner loading-xl"></span>;
            case "undiscovered":
                return <FontAwesomeIcon icon={faQuestion as IconProp} />;
            case "fish":
                return <div className="aspect-square border-4 rounded-full p-1 text-center">
                    <FontAwesomeIcon icon={faFish as IconProp} />
                </div>
            case "bountiful":
                return <div className="aspect-square border-4 rounded-full p-1 text-center text-yellow-400">
                    <FontAwesomeIcon icon={faFish as IconProp} />
                </div>
            default:
                return <div className="aspect-square border-4 text-center">
                    {label}
                </div>
        };
    };

    useEffect(() => {
        if (label === "undiscovered") {
            setIsDiscovered(false);
        };
        setTileLabel(label);
    }, [label]);

    return (
        <div
            onClick={() => { handleClick() }}
            className={clsx(
                'card w-full aspect-square bg-blue-500 border-blue-700 shadow-sm border-r-4 border-b-4',
                { "hover:bg-blue-400 hover:border-blue-500 transition-all duration-300 ease-in-out": !isDiscovered },
                { "cursor-pointer": !disabled && !isDiscovered },
                { "pointer-events-none bg-gray-500 border-gray-700": disabled && !isPending && !isDiscovered }
            )
            }>
            <div className={`card-body justify-center items-center p-0 text-2xl xs:text-3xl xl:text-4xl font-semibold text-white`}>
                {determineLabel(tileLabel)}
            </div>
        </div >
    )
}

export default FishingTile;