import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice, faFlag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Bounty } from "@src/types";
import { useGameStore } from "@src/stores/gameStore";
import { deleteBounty } from '@lib/apiClient';
import ResponsiveCard from "@components/Responsive/ResponsiveCard";
import BountyRewardIcon from "./BountyRewardIcon";
import ButtonPress from "@src/components/Animated/Button/ButtonPress";
import ProgressBar from '@src/components/Animated/ProgressBar';
import ConfirmButton from '@src/components/ConfirmButton/ConfirmButton';

interface BountyCardProps {
    bounty: Bounty;
};

const BountyCard = ({ bounty }: BountyCardProps) => {
    const queryClient = useQueryClient();
    const gameStore = useGameStore();

    let color;
    if (bounty?.category === 'gathering') {
        color = 'success';
    } else if (bounty?.category === 'crafting') {
        color = 'info';
    } else {
        color = 'error';
    }

    const { mutateAsync: deleteCharacterBounty } = useMutation({
        mutationKey: ['characterBounties'],
        mutationFn: async () => deleteBounty(bounty.id),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['characterBounties'] });
            const deletedBounty = bounty;
            queryClient.setQueryData(['characterBounties'], (old: Bounty[] | undefined) => {
                if (!old) return old;
                return old.filter((bounty: Bounty) => bounty.id !== deletedBounty.id);
            });
            const previousTrackedBounty = gameStore.trackedBounty;
            if (gameStore?.trackedBounty?.id === bounty.id) {
                gameStore.setTrackedBounty(undefined);
                localStorage.removeItem('trackedBounty');
            }
            return { deletedBounty, previousTrackedBounty };
        },
        onError: (error, _, context) => {
            if (error) {
                toast.error(`Something went wrong deleting bounty please try again.`);
            }
            queryClient.setQueryData(['characterBounties'], (old: Bounty[] | undefined) => {
                if (!old) return old;
                return [...old, context?.deletedBounty];
            });
            if (context?.previousTrackedBounty) {
                gameStore.setTrackedBounty(context?.previousTrackedBounty);
                localStorage.setItem('trackedBounty', JSON.stringify(context?.previousTrackedBounty));
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['characterBounties'] });
        }
    });

    // Keep this code commented just for reference on how to use optimistic updates
    // const { mutateAsync: toggleActive } = useMutation({
    //     mutationFn: async () => updateBounty(bounty.id, { active: bounty.active }),
    //     onMutate: async () => {
    //         await queryClient.cancelQueries({ queryKey: ['characterBounties'] });

    //         const previousBounty = gameStore.trackedBounty;

    //         if (bounty.active) {
    //             gameStore.setTrackedBounty(undefined);
    //             bounty.active = false;
    //         } else {
    //             gameStore.setTrackedBounty(bounty);
    //             bounty.active = true;
    //             if (previousBounty) {
    //                 await updateBounty(previousBounty.id, { active: false });
    //             }
    //         }

    //         return { previousBounty };
    //     },
    //     onError: (error, _, context) => {
    //         toast.error(`Something went wrong updating bounty: ${(error as Error).message}`);
    //         bounty.active = !bounty.active; // Revert the active state
    //         gameStore.setTrackedBounty(context?.previousBounty); // Restore the previous bounty state
    //     },
    //     onSettled: () => {
    //         queryClient.invalidateQueries({ queryKey: ['characterBounties'] });
    //     }
    // });

    const handleToggleActive = async () => {
        if (gameStore?.trackedBounty?.id === bounty.id) {
            gameStore.setTrackedBounty(undefined);
            localStorage.removeItem('trackedBounty');
        } else {
            gameStore.setTrackedBounty(bounty);
            localStorage.setItem('trackedBounty', JSON.stringify(bounty));
        }
    }

    return (
        <ResponsiveCard className={gameStore?.trackedBounty?.id === bounty.id ? "border-4 border-primary" : ""} >
            <div className="card-body">
                {/* Name */}
                <div className="flex flex-row relative items-center justify-between">
                    <div></div>
                    <div className="flex flex-row absolute w-full gap-2 items-center justify-center">
                        {bounty?.category === 'gathering' && <div className="tooltip" data-tip="Gathering"><img src="/images/gathering.png" alt="Gathering" className="w-5 h-5" /></div>}
                        {bounty?.category === 'crafting' && <div className="tooltip" data-tip="Crafting"><img src="/images/crafting.png" alt="Crafting" className="w-5 h-5" /></div>}
                        {bounty?.category === 'combat' && <div className="tooltip" data-tip="Combat"><img src="/images/swords.png" alt="Combat" className="w-5 h-5" /></div>}
                        <h2 className="card-title">{bounty.name}</h2>
                    </div>
                    <div className={`tooltip`} data-tip={gameStore?.trackedBounty?.id === bounty.id ? "Untrack bounty" : "Track bounty"}>
                        <button
                            className={`btn btn-ghost btn-circle text-lg hover:text-primary ${gameStore?.trackedBounty?.id === bounty.id ? "text-primary" : "text-gray-300"}`}
                            onClick={() => { handleToggleActive() }}
                        >
                            <FontAwesomeIcon icon={faFlag} />
                        </button>
                    </div>
                </div>
                {/* Indicator */}
                <div className="flex justify-center">
                    <div className="indicator w-20">
                        <span className="indicator-item indicator-bottom indicator-center badge border-base-content">
                            {bounty?.required_progress}/{bounty?.required_quantity}
                        </span>
                        <div className="p-2 border-4 rounded-lg" style={{ borderColor: `var(--color-${color})` }}>
                            {bounty?.required_item &&
                                <img src={bounty?.required_item?.image} alt="Bounty" />}
                            {bounty?.required_monster &&
                                <img src={bounty?.required_monster?.image} alt="Bounty" />}
                        </div>
                    </div>
                </div>
                {/* Progress Bar */}
                <ProgressBar
                    backgroundClassName='h-4 mt-3'
                    foregroundClassName={`${bounty.category === 'gathering' ? 'bg-success' : bounty.category === 'crafting' ? 'bg-info' : 'bg-error'}`}
                    width={Math.floor((bounty?.required_progress / bounty?.required_quantity) * 100)}
                />
                {/* Rewards */}
                <div className="text-center">Rewards</div>
                <div className="flex flex-row flex-wrap gap-1 items-center justify-center">
                    {/* Item */}
                    {bounty?.reward_item && bounty?.reward_item_quantity &&
                        <BountyRewardIcon
                            tooltip={
                                <div>
                                    <p className="text-base font-bold">{bounty?.reward_item?.name}</p>
                                    Amount: <i>{bounty?.reward_item_quantity}</i>
                                </div>
                            }
                            indicatorText={bounty?.reward_item_quantity?.toString()}
                            image={<img src={bounty?.reward_item?.image} alt={bounty?.reward_item?.name} />}
                        />}
                    {/* Gold */}
                    {bounty?.gold &&
                        <BountyRewardIcon
                            tooltip={
                                <div>
                                    <p className="text-base font-bold">Gold</p>
                                    Amount: <i>{bounty?.gold}</i>
                                </div>
                            }
                            indicatorText={bounty?.gold?.toString()}
                            image={<img src="/images/coins.png" alt="Coins" />}
                        />}
                    {/* Experience */}
                    {bounty?.experience &&
                        <BountyRewardIcon
                            tooltip={
                                <div>
                                    <p className="text-base font-bold">Experience</p>
                                    Amount: <i>{bounty?.experience}</i>
                                </div>
                            }
                            indicatorText={bounty?.experience?.toString()}
                            image={<img src="/images/xp.png" alt="Experience" />}
                        />}
                    {/* Tokens */}
                    {bounty?.bounty_tokens &&
                        <BountyRewardIcon
                            tooltip={
                                <div>
                                    <p className="text-base font-bold">Bounty Tokens</p>
                                    Amount: <i>{bounty?.bounty_tokens}</i>
                                </div>
                            }
                            indicatorText={bounty?.bounty_tokens?.toString()}
                            image={<img src="/images/bounty_token.png" alt="Bounty Tokens" />}
                        />}
                </div>
            </div>
            {/* Buttons */}
            <div className="card-actions justify-between pl-5 pb-5 pr-5">
                <div className="flex gap-1">
                    {/* Delete */}
                    <ConfirmButton
                        className="btn-secondary"
                        confirmContent={
                            <div className="flex flex-row gap-1 items-center">
                                1,000 <img src="/images/coins.png" alt="Coins" className="w-5" />
                            </div>
                        }
                        onClick={deleteCharacterBounty}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </ConfirmButton>
                    {/* Reroll */}
                    <ConfirmButton
                        className="btn-accent text-primary-content"
                        confirmContent={
                            <div className="flex flex-row gap-1 items-center">
                                1 Token <img src="/images/bounty_token.png" alt="Bounty Tokens" className="w-5" />
                            </div>
                        }
                    >
                        Reroll <FontAwesomeIcon icon={faDice} />
                    </ConfirmButton>
                </div>
                {/* Accept */}
                <ButtonPress className='btn-primary'>
                    Complete
                </ButtonPress>
            </div>
        </ResponsiveCard >
    )
}


export default BountyCard;