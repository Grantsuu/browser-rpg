import { useMutation, useQueryClient } from '@tanstack/react-query';
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { item } from '../types/types';
import { useInventory } from '../lib/stateMangers';
import { removeItemFromInventory } from '../lib/apiClient';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';

const Inventory = () => {
    const queryClient = useQueryClient();

    const { data, error, isLoading } = useInventory();

    const { mutate, isPending } = useMutation({
        mutationFn: (itemId: number) => removeItemFromInventory(itemId),
        onSuccess: () => {
            toast.success('Item removed from inventory');
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to remove item from inventory: ${(error as Error).message}`);
        }
    })

    if (error) {
        toast.error(`Something went wrong fetching the Character's inventory: ${(error as Error).message}`);
    }

    return (
        <PageCard title="Inventory" icon={faBox}>
            <div className="flex flex-col overflow-x-hidden overflow-y-scroll w-max-full h-full rounded border border-base-content/8 ">
                <table className={`md:table table-compact table-pin-rows border-collapse bg-base-100 ${isLoading ? 'flex-1' : ''}`}>
                    {/* head */}
                    <thead>
                        <tr className="bg-secondary md:bg-secondary">
                            <th></th>
                            <th className="text-left p-1">Name</th>
                            <th className="text-left p-1">Category</th>
                            <th className="text-left p-1">Amount</th>
                            <th className="text-left p-1">Value</th>
                            <th className="hidden xl:inline-block">Description</th>
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
                            data.map((item: item, id: number) => {
                                return (
                                    <tr className="table-row items-baseline justify-baseline hover:bg-base-300" key={id}>
                                        <td className="p-1 w-15 xl:w-20">
                                            <img src={item.image.base64} />
                                        </td>
                                        <td className="p-1">
                                            {item.name}
                                        </td>
                                        <td className="p-1">
                                            <ItemCategoryBadge category={item.category} />
                                        </td>
                                        <td className="p-1">
                                            {item.amount}
                                        </td>
                                        <td className="p-1">
                                            {item.value}
                                        </td>
                                        <td className="hidden xl:inline-block">
                                            {item.description}
                                        </td>
                                        <td className="p-1">
                                            <button className="btn btn-soft btn-error btn-sm md:btn-md" onClick={() => { mutate(item.id) }} disabled={isPending}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </PageCard>
    )
}

export default Inventory;