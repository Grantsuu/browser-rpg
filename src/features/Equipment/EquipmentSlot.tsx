import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ButtonPress from "@components/Animated/Button/ButtonPress";
import type { EquipmentCategoryType, Item } from "@src/types";
import { getEquipmentByCategory, postEquipment, removeEquipment } from "@lib/apiClient";
import { toTitleCase } from "@utils/strings";
import ResponsiveDrawer from "@components/Responsive/ResponsiveDrawer";
import ColumnDelayDown from "@components/Animated/Motion/ColumnDelayDown";
import EquipmentStatDisplay from "@components/Items/EquipmentStatDisplay";

interface EquipmentSlotProps {
    category: EquipmentCategoryType;
    isLoading: boolean;
    placeholder: React.ReactNode;
    equipment?: Item;
}

const EquipmentSlot = ({ category, equipment, placeholder, isLoading }: EquipmentSlotProps) => {
    const queryClient = useQueryClient();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data: inventory, error: inventoryError, isLoading: isInventoryLoading } = useQuery({
        queryKey: ['inventoryEquipment', category],
        queryFn: () => getEquipmentByCategory(category)
    });

    const { mutateAsync: equip, isPending: isEquipPending } = useMutation({
        mutationFn: (variables: { equipment: Item }) => postEquipment(variables.equipment.equipment_id as number),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['equipment'], (oldData: Item[]) => {
                const newData = [
                    ...oldData,
                    variables.equipment
                ];
                return newData;
            });
            queryClient.setQueryData(['characterCombatStats'], data.updatedCombatStats);
            queryClient.setQueryData(['inventoryEquipment', category], (oldData: Item[]) => {
                const newData = oldData.filter((i) => i.equipment_id !== variables.equipment.equipment_id);
                return newData;
            });
        },
        onError: (error) => {
            toast.error(`Something went wrong equipping: ${(error as Error).message}`);
        }
    });

    const { mutateAsync: equipmentRemove, isPending: isRemovePending } = useMutation({
        mutationFn: async (variables: { equipment: Item }) => removeEquipment(variables.equipment.equipment_id as number),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['equipment'], (oldData: Item[]) => {
                return oldData.filter((i) => i.equipment_id !== variables.equipment.equipment_id);
            });
            queryClient.setQueryData(['characterCombatStats'], data.updatedCombatStats);
            queryClient.setQueryData(['inventoryEquipment', category], (oldData: Item[]) => {
                const newData = [
                    ...oldData,
                    variables.equipment
                ];
                return newData;
            });
        },
        onError: (error) => {
            toast.error(`Something went wrong removing equipment: ${(error as Error).message}`);
        }
    });

    const handleEquip = async (equipment: Item) => {
        setIsDrawerOpen(false);
        await equip({ equipment });
    }

    return (
        <>
            <div className="flex flex-row gap-1 lg:gap-3">
                <div
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex justify-center aspect-square w-1/3 p-2 rounded-lg border-5 hover:bg-base-200 hover:cursor-pointer active:bg-base-300"
                >
                    {(isLoading || isEquipPending || isRemovePending) ?
                        <div className="skeleton h-full w-full" /> :
                        equipment?.image ?
                            <img src={equipment?.image} alt={category} /> :
                            placeholder
                    }
                </div>
                <div className="flex flex-col justify-between gap-1 w-2/3">
                    {(isLoading || isEquipPending || isRemovePending) ? <div className="skeleton h-4 w-full" /> : <div className="text-base font-semibold">{toTitleCase(category as string)}</div>}
                    {(isLoading || isEquipPending || isRemovePending) ?
                        <div className="skeleton h-4 w-4/5" /> :
                        equipment?.name ?
                            equipment?.name :
                            `None`
                    }
                    {(isLoading || isEquipPending || isRemovePending) ? <div className="skeleton h-4 w-full" /> : equipment && <EquipmentStatDisplay equipment={equipment} showLevel={false} />}
                    {equipment ?
                        <ButtonPress onClick={() => { equipmentRemove({ equipment }) }} className="btn-secondary btn-sm btn-outline" disabled={isLoading}>
                            {(isEquipPending || isRemovePending) ? <div className="loading loading-spinner"></div> : `Unequip`}
                        </ButtonPress> :
                        <ButtonPress onClick={() => setIsDrawerOpen(true)} className="btn-primary btn-sm" disabled={isLoading}>
                            {isEquipPending ? <div className="loading loading-spinner"></div> : `Equip`}
                        </ButtonPress>}
                </div>
            </div>
            <ResponsiveDrawer title={toTitleCase(category)} icon="images/equipment.png" open={isDrawerOpen} setOpen={setIsDrawerOpen}>
                {isDrawerOpen && <div className="flex flex-col gap-2 h-full">
                    <div className="text-base font-semibold self-center">Currently Equipped</div>
                    {equipment && <div className="card card-sm w-full bg-base-100 shadow-md border-6 border-base-300 hover:bg-base-200">
                        <div className="card-body p-2">
                            <div className="flex flex-row">
                                <img src={equipment?.image} alt={equipment?.name} className="w-1/4 xl:w-1/5 p-1 border-5 rounded-lg" />
                                <div className="flex flex-row justify-between w-full ml-2">
                                    <div className="flex flex-col self-start gap-1">
                                        <div className="flex flex-col lg:gap-1 items-start lg:flex-row lg:items-center">
                                            <div className="text-base font-semibold">{equipment?.name}</div>
                                            {equipment?.equipment_category && <div className="badge badge-primary badge-sm">{toTitleCase(equipment?.equipment_category)}</div>}
                                        </div>
                                        <EquipmentStatDisplay equipment={equipment} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    <div className="divider m-0"></div>
                    <div className="text-base font-semibold self-center">In Inventory</div>
                    {inventoryError ?
                        <span className="h-full text-center">Something went wrong fetching inventory.</span> :
                        isInventoryLoading ?
                            <span className="loading loading-spinner loading-lg" /> :
                            inventory?.sort((a: Item, b: Item) => a.id - b.id).map((equipment: Item, index: number) => {
                                return (
                                    <ColumnDelayDown index={index} key={index}>
                                        <div className="card card-sm w-full bg-base-100 shadow-md border-6 border-base-300 hover:bg-base-200">
                                            <div className="card-body p-2">
                                                <div className="flex flex-row">
                                                    <img src={equipment?.image} alt={equipment?.name} className="w-1/4 xl:w-1/5 p-1 border-5 rounded-lg" />
                                                    <div className="flex flex-row justify-between w-full ml-2">
                                                        <div className="flex flex-col self-start gap-1">
                                                            <div className="flex flex-col lg:gap-1 items-start lg:flex-row lg:items-center">
                                                                <div className="text-base font-semibold">{equipment?.name}</div>
                                                                {equipment?.equipment_subcategory && <div className="badge badge-primary badge-sm">{toTitleCase(equipment?.equipment_subcategory)}</div>}
                                                            </div>
                                                            <EquipmentStatDisplay equipment={equipment} />
                                                        </div>
                                                        <ButtonPress onClick={() => { handleEquip(equipment) }} className="btn-primary btn-md self-center" disabled={isLoading}>
                                                            Equip
                                                        </ButtonPress>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ColumnDelayDown>
                                );
                            })
                    }
                </div>
                }
            </ResponsiveDrawer>
        </>
    );
};

export default EquipmentSlot;