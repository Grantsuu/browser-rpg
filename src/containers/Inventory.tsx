import { useMutation, useQueryClient } from '@tanstack/react-query';
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { clsx } from 'clsx';
import type { CombatData, item } from '../types/types';
import { useInventory } from '../lib/stateMangers';
import { putUseItem, removeItemFromInventory } from '../lib/apiClient';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/Badges/ItemCategoryBadge';
import SuccessToast from '../components/Toasts/SuccessToast';
import ButtonPress from '../components/Animated/Button/ButtonPress';

const Inventory = () => {
    const queryClient = useQueryClient();

    const { data, error, isLoading } = useInventory();

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: { item: item }) => removeItemFromInventory(variables.item.id),
        onSuccess: (_, variables) => {
            toast.success(
                <SuccessToast
                    action="Deleted"
                    name={variables.item.name}
                    image={variables.item.image}
                />);
            queryClient.setQueryData(['inventory'], (oldData: item[]) => {
                const itemIndex = oldData.findIndex((i) => i.id === variables.item.id);
                oldData.splice(itemIndex, 1);
                return oldData;
            });
        },
        onError: (error: Error) => {
            toast.error(`Failed to remove item from inventory: ${(error as Error).message}`);
        }
    })

    const { mutateAsync: itemUse, isPending: useItemLoading } = useMutation({
        mutationFn: (variables: { item: item }) => putUseItem(variables.item.id),
        onSuccess: (data, variables) => {
            toast.success(
                <SuccessToast
                    action="Used"
                    name={variables.item.name}
                    amount={1}
                    image={variables.item.image}
                />
            );
            queryClient.setQueryData(['inventory'], (oldData: item[]) => {
                // We know the item is in the inventory because we just used it and the API checks before using it
                const itemIndex = oldData.findIndex((i) => i.id === variables.item.id);
                // Have to check if item being removed had its amount reduced or removed entirely
                if (data.inventory_item) {
                    oldData[itemIndex].amount = data.inventory_item.amount;
                } else {
                    oldData.splice(itemIndex, 1);
                }
                return oldData;
            });
            queryClient.setQueryData(['combat'], (oldData: CombatData) => {
                return { ...oldData, ...data.character_combat };
            });
        },
        onError: (error: Error) => {
            toast.error(`Failed to use item: ${(error as Error).message}`);
        }
    });

    const handleUseItem = async (item: item) => {
        await itemUse({ item });
    }
    if (error) {
        toast.error(`Something went wrong fetching the Character's inventory: ${(error as Error).message}`);
    }

    return (
        <PageCard title="Inventory" icon={faBox} >
            <table className={clsx('xs:table-xs sm:table-sm md:table-md table-compact table-pin-rows bg-base-100', { 'flex-1': isLoading })}>
                {/* head */}
                <thead>
                    <tr className="bg-secondary md:bg-secondary">
                        <th className="w-10"></th>
                        <th className="text-left p-1">Name</th>
                        <th className="hidden xs:table-cell text-left p-1">Category</th>
                        <th className="text-left p-1">Amount</th>
                        <th className="text-left p-1">Value</th>
                        <th className="hidden xl:table-cell">Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ?
                        <tr>
                            <td colSpan={7}>
                                <div className="flex items-center justify-center">
                                    <span className="loading loading-spinner loading-xl"></span>
                                </div>
                            </td>
                        </tr> :
                        data.sort((a: item, b: item) => a.id - b.id).map((item: item, id: number) => {
                            return (
                                <tr className="table-row items-baseline justify-baseline hover:bg-base-300" key={id}>
                                    <td className="p-2 xs:p-1 w-1/8 sm:w-1/10 xl:w-1/18">
                                        <img src={item.image.base64} alt={item.image.alt} title={item.image.alt} />
                                    </td>
                                    <td className="p-1">
                                        {item.name}
                                    </td>
                                    <td className="hidden xs:table-cell p-1">
                                        <ItemCategoryBadge category={item.category} />
                                    </td>
                                    <td className="p-1">
                                        {item.amount}
                                    </td>
                                    <td className="p-1">
                                        {item.value}
                                    </td>
                                    <td className="hidden xl:table-cell">
                                        {item.description}
                                    </td>
                                    <td className="p-1 flex flex-row gap-1 justify-end">
                                        {item.category === "consumable" && <ButtonPress
                                            className="btn-soft btn-primary btn-sm md:btn-md"
                                            onClick={() => { handleUseItem(item) }}
                                            disabled={isPending || useItemLoading}
                                        >
                                            Use
                                        </ButtonPress>}
                                        <button className="btn btn-soft btn-error btn-sm md:btn-md" onClick={() => { mutate({ item }) }} disabled={isPending || useItemLoading}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </PageCard>
    )
}

export default Inventory;