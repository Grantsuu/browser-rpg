import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeftLong, faHand, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import type { CombatData, Item, ItemEffectData } from "@src/types";
import { useCharacter, useCharacterLevels, useInventory } from "@lib/stateMangers";
import { putResetCombat, putUpdateCombat } from "@lib/apiClient";
import { useConfetti } from '@contexts/ConfettiContext';
import ResponsiveDrawer from "@components/Responsive/ResponsiveDrawer";
import ButtonPress from "@components/Animated/Button/ButtonPress";
import ProgressBar from "@components/Animated/ProgressBar";
import CombatRewardsToast from "@components/Toasts/CombatRewardsToast";
import SuccessToast from "@components/Toasts/SuccessToast";
import LevelUpToast from "@components/Toasts/LevelUpToast";
import ItemUseToast from "@src/components/Toasts/ItemUseToast";
import ColumnDelayDown from "@components/Animated/Motion/ColumnDelayDown";
import ItemEffectDisplay from "@src/components/Items/ItemEffectDisplay";

interface CombatProps {
    combat: CombatData;
}

const Combat = ({ combat }: CombatProps) => {
    const queryClient = useQueryClient();
    const { levelUpConfetti } = useConfetti();
    const { data: character } = useCharacter();
    const { data: inventory, error: inventoryError, isLoading: isInventoryLoading } = useInventory();
    const { data: characterLevels } = useCharacterLevels();
    const [showAnimation, setShowAnimation] = useState(false);

    const [showItemDrawer, setShowItemDrawer] = useState(false);

    useEffect(() => {
        if (showAnimation) {
            setShowAnimation(false);
        }
    }, [showAnimation]);

    const { mutateAsync: updateCombat, isPending: combatLoading } = useMutation({
        mutationFn: (variables: { action: string, id?: number }) => putUpdateCombat(variables.action, variables.id),
        onSuccess: (data) => {
            setShowAnimation(true);
            queryClient.setQueryData(['combat'], data);
            if (data?.state?.outcome?.rewards) {
                toast.success(<CombatRewardsToast combatData={data} />);
                // Loot toast
                const loot = data?.state?.outcome?.rewards?.loot;
                if (loot?.length > 0) {
                    toast.info(<SuccessToast action='Looted' name={loot[0].item.name} amount={loot[0].quantity} image={loot[0].image} />);
                }
                // Level up toast
                if (data?.state?.outcome?.rewards?.level) {
                    levelUpConfetti();
                    toast.info(
                        <LevelUpToast
                            level={data?.state?.outcome?.rewards?.level}
                            skill="Combat"
                        />);
                }
            }
            if (data?.state?.last_actions?.player?.action === 'use_item') {
                toast.success(<ItemUseToast item={data?.state?.last_actions?.player?.item} amount={1} results={data?.state?.last_actions?.player?.results} />);
                queryClient.setQueryData(['characterCombatStats'], data.player);
            }
        },
        onError: (error) => {
            toast.error(`Something went wrong starting combat: ${(error as Error).message}`);
        }
    });

    const { mutateAsync: resetCombat, isPending: resetLoading } = useMutation({
        mutationFn: () => putResetCombat(),
        onSuccess: (data) => {
            queryClient.setQueryData(['combat'], data);
        },
        onError: (error) => {
            toast.error(`Something went wrong resetting combat: ${(error as Error).message}`);
        }
    });

    return (
        <div className="flex flex-col items-center gap-2">
            {/* Monster card */}
            <motion.div
                className="w-full lg:w-1/3"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                key="combat-monster"
            >
                <div className="card card-lg border border-gray-100 shadow-md">
                    <div className="card-body p-3 items-center">
                        <h2 className="card-title text-center">{combat.monster.name}</h2>
                        <div className="relative z-0 w-1/3">
                            <AnimatePresence initial={false}>
                                {combat?.state?.last_actions?.player?.action === 'attack' && showAnimation && (
                                    <motion.div
                                        initial={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0.0, y: -75 }}
                                        transition={{ duration: 1.00, ease: "circOut" }}
                                        key="monster-damage-animation"
                                        className="absolute z-10 flex justify-center items-center w-full h-full top-0 left-0"
                                    >
                                        <div className="text-red-500 text-2xl font-bold">{combat?.state?.last_actions?.player?.amount}</div>
                                    </motion.div>)}
                            </AnimatePresence >
                            <img src={combat.monster.image} alt={combat.monster.name} title={combat.monster.name} />
                        </div>
                        <div className="flex flex-row gap-1">
                            <img src="images/heart.png" className="w-5" />
                            <div className="font-semibold">{combat.monster.health}/{combat.monster.max_health}</div>
                        </div>
                        <ProgressBar foregroundClassName="bg-red-500" width={Math.floor((combat.monster.health / combat.monster.max_health) * 100)} />
                    </div>
                </div>
            </motion.div>
            {/* Combat log */}
            {combat?.state?.last_actions && <>
                {(combat?.state?.last_actions?.player) &&
                    <div className="flex flex-row gap-1">
                        {combat?.state?.last_actions?.player?.action === 'attack' &&
                            <>
                                <img src="images/sword.png" className="w-5" />
                                <span>
                                    <span className="font-semibold">{character.name}</span> <span className="text-red-500 italic">attacks</span> for <span className="text-red-500 font-bold">{combat?.state?.last_actions?.player?.amount}</span> damage!
                                </span>
                            </>}
                        {combat?.state?.last_actions?.player?.action === 'defend' &&
                            <>
                                <img src="images/shield.png" className="w-5" />
                                <span>
                                    <span className="font-semibold">{character.name}</span> <span className="text-green-500 italic">defends</span> and recovers <span className="text-green-500 font-bold">{combat?.state?.last_actions?.player?.amount}</span> health!
                                </span>
                            </>}
                        {((combat?.state?.last_actions?.player?.action === 'flee') && !combat?.state?.outcome) &&
                            <>
                                <img src="images/running.png" className="w-5" />
                                <span>
                                    <span className="font-semibold">{character.name}</span> <span className="text-red-500 italic">failed</span> to <span className="text-blue-500">flee</span>!
                                </span>
                            </>}
                    </div>}
                {combat?.state?.last_actions?.monster && <div className="flex flex-row gap-1">
                    <img src="images/sword.png" className="w-5" />
                    <span>
                        <span className="font-semibold">{combat.monster.name}</span> <span className="text-red-500 italic">{`${combat?.state?.last_actions?.monster.action}s`}</span> for <span className="text-red-500 font-bold">{combat?.state?.last_actions?.monster?.amount}</span> damage!
                    </span>
                </div>}
                {combat?.state?.outcome && <>
                    {combat?.state?.outcome?.status === 'player_wins' && <div className="flex flex-row gap-1">
                        <img src="images/sword.png" className="w-5" />
                        <span>
                            <span className="font-semibold">{character.name}</span> <span className="text-green-500 italic">defeated</span> <span className="font-semibold">{combat.monster.name}</span>!
                        </span>
                    </div>}
                    {combat?.state?.outcome?.status === 'player_loses' && <div className="flex flex-row gap-1">
                        <img src="images/sword.png" className="w-5" />
                        <span>
                            <span className="font-semibold">{combat.monster.name}</span> <span className="text-red-500 italic">defeated</span> <span className="font-semibold">{character.name}</span>!
                        </span>
                    </div>}
                    {combat?.state?.outcome?.status === 'player_flees' && <div className="flex flex-row gap-1">
                        <img src="images/running.png" className="w-5" />
                        <span>
                            <span className="font-semibold">{character.name}</span> <span className="text-blue-500 italic">fled</span> from <span className="font-semibold">{combat.monster.name}</span>!
                        </span>
                    </div>}
                    {/* {combat?.state?.outcome?.rewards && <>
                        {JSON.stringify(combat?.state?.outcome?.rewards)}
                    </>} */}
                </>
                }
            </>}
            {/* Player card */}
            <motion.div
                className="w-full lg:w-1/2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                key="combat-player"
            >
                <div className="card card-lg border border-gray-100 shadow-md">
                    <div className="card-body p-3 items-center">
                        <div className="relative z-0 w-full">
                            {/* Animated numbers for player health */}
                            <AnimatePresence initial={false}>
                                {combat?.state?.last_actions?.monster?.action === 'attack' && showAnimation && (
                                    <motion.div
                                        initial={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0.0, y: -75 }}
                                        transition={{ duration: 1.00, ease: "circOut" }}
                                        key="monster-damage-animation"
                                        className="absolute z-10 flex justify-start items-center w-full h-full top-0 left-0"
                                    >
                                        <div style={{ width: `${Math.floor((combat.player.health / combat.player.max_health) * 100)}%` }}></div>
                                        <div className="text-red-500 text-2xl font-bold">{combat?.state?.last_actions?.monster?.amount}</div>
                                    </motion.div>)}
                            </AnimatePresence >
                            {/* Player name and level */}
                            <div className="flex justify-center">
                                <h2 className="card-title">{character.name} Lvl. {characterLevels.combat_level}</h2>
                            </div>
                        </div>
                        {/* Health and Mana Bars */}
                        <ProgressBar foregroundClassName="bg-green-500" width={Math.floor((combat.player.health / combat.player.max_health) * 100)} />
                        <ProgressBar foregroundClassName="bg-blue-500" width={100} />
                        {/* Health and Mana Numbers */}
                        <div className="flex flex-row w-full justify-between">
                            <div className="flex flex-row gap-1">
                                <img src="images/heart.png" className="w-5" />
                                <div className="font-semibold">{combat.player.health}/{combat.player.max_health}</div>
                            </div>
                            <div className="flex flex-row gap-1">
                                <img src="images/magic-wand.png" className="w-5" />
                                <div className="font-semibold">5/5</div>
                            </div>
                        </div>
                        {/* Combat Buttons */}
                        {combat.state.outcome ?
                            // Post Combat Buttons
                            <div className="grid grid-cols-2 gap-1 lg:gap-3 w-full">
                                {/* Return to Training Area selection screen */}
                                <ButtonPress
                                    className="btn-secondary btn-outline"
                                    onClick={() => { resetCombat(); }}
                                    disabled={combatLoading || resetLoading}
                                >
                                    <FontAwesomeIcon icon={faArrowLeftLong as IconProp} /> Return to Areas
                                </ButtonPress>
                                {/* Fight same monster again */}
                                <ButtonPress
                                    className="btn-primary text-white"
                                    onClick={() => { updateCombat({ action: "start", id: combat.monster.id }); }}
                                    disabled={combatLoading || resetLoading}
                                >
                                    <FontAwesomeIcon icon={faRotateRight as IconProp} /> Fight Again
                                </ButtonPress>
                            </div> :
                            // Combat Actions
                            <div className="grid grid-cols-4 w-full gap-1 lg:gap-2">
                                {/* Attack */}
                                <ButtonPress
                                    className="btn btn-primary w-full"
                                    onClick={() => { updateCombat({ action: 'attack' }); }}
                                    disabled={combatLoading}
                                >
                                    <img src="images/sword.png" className="w-5" />Attack
                                </ButtonPress>
                                {/* Defend */}
                                <ButtonPress
                                    className="btn btn-warning"
                                    onClick={() => { updateCombat({ action: 'defend' }); }}
                                    disabled={combatLoading}
                                >
                                    <img src="images/shield.png" className="w-5" />Defend
                                </ButtonPress>
                                {/* Items */}
                                <ButtonPress
                                    className="btn btn-success"
                                    disabled={combatLoading}
                                    onClick={() => { setShowItemDrawer(true); }}
                                >
                                    <img src="images/backpack.png" className="w-5" />Items
                                </ButtonPress>
                                {/* Flee */}
                                <ButtonPress
                                    className="btn btn-secondary"
                                    onClick={() => { updateCombat({ action: 'flee' }); }}
                                    disabled={combatLoading}
                                >
                                    <img src="images/running.png" className="w-5" />Flee
                                </ButtonPress>
                            </div>}
                    </div>
                </div>
            </motion.div>
            <ResponsiveDrawer title="Items" icon="images/backpack.png" open={showItemDrawer} setOpen={setShowItemDrawer}>
                {showItemDrawer && <div className="flex flex-col gap-2 h-full">
                    {isInventoryLoading ? <span className="h-full loading loading-spinner loading-xl self-center"></span> :
                        inventoryError ? <span className="h-full text-center">Something went wrong fetching inventory.</span> :
                            inventory?.filter((item: Item) => item.item_category === "consumable").map((item: Item, index: number) => (
                                <ColumnDelayDown index={index} key={index}>
                                    {/* Item Card */}
                                    <div className="card card-sm w-full bg-base-100 shadow-md">
                                        <div className="card-body">
                                            <div className="flex items-center justify-between">
                                                {/* Item Info */}
                                                <div key={index} className="flex flex-row gap-1 lg:gap-3 items-center">
                                                    <img src={item.image} alt={item.name} title={item.name} className="w-1/10" />
                                                    <div className="flex flex-col">
                                                        <div className="text-lg font-semibold">{item.name}</div>
                                                        <div className="text-base">
                                                            <ItemEffectDisplay effects={item.item_effects as ItemEffectData[]} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Use Button */}
                                                <ButtonPress
                                                    className="btn-primary"
                                                    onClick={async () => {
                                                        setShowItemDrawer(false);
                                                        await updateCombat({ action: 'use_item', id: item.id });
                                                    }}
                                                    disabled={isInventoryLoading || combatLoading}
                                                >
                                                    <FontAwesomeIcon icon={faHand as IconProp} className="text-lg" />
                                                </ButtonPress>
                                            </div>
                                        </div>
                                    </div>
                                </ColumnDelayDown>
                            ))
                    }
                </div>}
            </ResponsiveDrawer >
        </div >
    );
};
export default Combat;