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
            <div className="flex flex-col overflow-y-scroll w-full h-full rounded border border-base-content/8 ">
                <table className={`table table-pin-rows bg-base-100 ${isLoading ? 'flex-1' : ''}`}>
                    {/* head */}
                    <thead>
                        <tr className="bg-secondary">
                            <th></th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Value</th>
                            <th>Description</th>
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
                                    <tr className="table-row items-baseline justify-baseline hover:bg-base-300 m-0" key={id}>
                                        <td className="m-0 w-1/16">
                                            <img src={item.image.base64} />
                                        </td>
                                        <td>
                                            {item.name}
                                        </td>
                                        <td>
                                            <ItemCategoryBadge category={item.category} />
                                        </td>
                                        <td>
                                            {item.amount}
                                        </td>
                                        <td>
                                            {item.value}
                                        </td>
                                        <td>
                                            {item.description}
                                        </td>
                                        <td>
                                            <button className="btn btn-soft btn-error" onClick={() => { mutate(item.id) }} disabled={isPending}>Delete</button>
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