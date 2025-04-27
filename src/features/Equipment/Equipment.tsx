import PageCard from "@src/layouts/PageCard";
import { useQuery } from "@tanstack/react-query";
import type { Equipment } from "@src/types";
import { getCharacterEquipment } from "@lib/apiClient";
import { useCharacterCombatStats } from "@src/lib/stateMangers";

const Equipment = () => {

    const { data: combatStats, isLoading: isCombatStatsLoading } = useCharacterCombatStats();

    const { data: equipment, isLoading: isEquipmentLoading } = useQuery({
        queryKey: ['equipment'],
        queryFn: getCharacterEquipment
    });

    const equippedWeapon = equipment?.find((equipment: Equipment) => equipment.category === 'weapon');
    const equippedArmor = equipment?.find((equipment: Equipment) => equipment.category === 'armor');
    const equippedAccessory = equipment?.find((equipment: Equipment) => equipment.category === 'accessory');

    return (
        <PageCard title="Equipment" icon='/images/equipment.png'>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="card shadow-sm border-2 border-base-200 w-full md:w-1/2 lg:w-1/4">
                    <div className="card-body gap-1">
                        <h2 className="card-title">
                            Combat Stats
                            <img src='/images/stats.png' alt="Stats" className="w-5 h-5" />
                        </h2>
                        <div className="divider m-0" />
                        <div>
                            <div className="flex flex-row items-center gap-1">
                                <div className="font-semibold text-nowrap">Max Health:</div>
                                <div className="w-full text-end">{isCombatStatsLoading ? <div className="skeleton h-3 w-full"></div> : combatStats?.max_health}</div>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <div className="font-semibold">Power:</div>
                                <div className="w-full text-end">{isCombatStatsLoading ? <div className="skeleton h-3 w-full"></div> : combatStats?.power}</div>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <div className="font-semibold">Toughness:</div>
                                <div className="w-full text-end">{isCombatStatsLoading ? <div className="skeleton h-3 w-full"></div> : combatStats?.toughness}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card shadow-sm border-2 border-base-200 w-full md:w-1/2 lg:w-1/4">
                    <div className="card-body gap-1">
                        <h2 className="card-title justify-center">
                            Equipped
                            <img src='/images/equipment.png' alt="Equipped" className="w-5 h-5" />
                        </h2>
                        <div className="divider m-0" />
                        <div className="grid grid-cols-2 gap-2 gap-x-2">

                            <div className="flex justify-center aspect-square w-20 p-1 rounded-lg border-5 bg-base-200 hover:bg-base-300 hover:cursor-pointer">
                                {isEquipmentLoading ?
                                    <span className="loading loading-spinner w-10" /> :
                                    <img src={equippedWeapon?.item?.image ? equippedWeapon?.item?.image : '/images/weapon_placeholder.png'} alt="Weapon" />}
                            </div>
                            <div>
                                <div className="text-base font-semibold">Weapon</div>
                                <div>{equippedWeapon?.item?.name}</div>
                            </div>
                            <img src='/images/armor_placeholder.png' alt="Armor" className="w-20 p-1 rounded-lg border-5 bg-base-200 hover:bg-base-300 hover:cursor-pointer" />
                            <div>
                                <div className="text-base font-semibold">Armor</div>
                                <div>{equippedArmor?.item?.name}</div>
                            </div>
                            <img src='/images/accessory_placeholder.png' alt="Accessory" className="w-20 p-1 rounded-lg border-5 bg-base-200 hover:bg-base-300 hover:cursor-pointer" />
                            <div>
                                <div className="text-base font-semibold">Accessory</div>
                                <div>{equippedAccessory?.item?.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageCard >
    )
}

export default Equipment;