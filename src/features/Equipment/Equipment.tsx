import PageCard from "@src/layouts/PageCard";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react"
import type { Equipment } from "@src/types";
import { getCharacterEquipment } from "@lib/apiClient";
import { useCharacterCombatStats } from "@src/lib/stateMangers";
import ArmorPlaceholder from "./Placeholders/ArmorPlaceholder";
import WeaponPlaceholder from "./Placeholders/WeaponPlaceholder";
import AccessoryPlaceholder from "./Placeholders/AccessoryPlaceholder";
import EquipmentSlot from "./EquipmentSlot";

const Equipment = () => {
    const { data: combatStats, isLoading: isCombatStatsLoading } = useCharacterCombatStats();

    const { data: equipment, isLoading: isEquipmentLoading } = useQuery({
        queryKey: ['equipment'],
        queryFn: getCharacterEquipment
    });

    const weapon = equipment?.find((item: Equipment) => item.category === 'weapon');
    const armor = equipment?.find((item: Equipment) => item.category === 'armor');
    const accessory = equipment?.find((item: Equipment) => item.category === 'accessory');

    return (
        <PageCard title="Equipment" icon='/images/equipment.png'>
            <div className="flex flex-col md:flex-row gap-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="card shadow-sm border-2 border-base-200 w-full md:w-1/2 xl:w-1/4"
                >
                    <div className="card-body gap-1">
                        <h2 className="card-title justify-center">
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
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="card shadow-sm border-2 border-base-200 w-full md:w-1/2 xl:w-1/4"
                >
                    <div className="card-body gap-1">
                        <h2 className="card-title justify-center">
                            Equipped
                            <img src='/images/equipment.png' alt="Equipped" className="w-5 h-5" />
                        </h2>
                        <div className="divider m-0" />
                        <div className="flex flex-col gap-2">
                            <EquipmentSlot category="weapon" placeholder={<WeaponPlaceholder />} isLoading={isEquipmentLoading} equipment={weapon} />
                            <EquipmentSlot category="armor" placeholder={<ArmorPlaceholder />} isLoading={isEquipmentLoading} equipment={armor} />
                            <EquipmentSlot category="accessory" placeholder={<AccessoryPlaceholder />} isLoading={isEquipmentLoading} equipment={accessory} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </PageCard >
    )
}

export default Equipment;