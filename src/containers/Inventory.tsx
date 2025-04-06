import { useMutation, useQueryClient } from '@tanstack/react-query';
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { item } from '../types/types';
import { useInventory } from '../lib/stateMangers';
import { removeItemFromInventory } from '../lib/apiClient';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';
import SuccessToast from '../components/Toasts/SuccessToast';

const Inventory = () => {
    const queryClient = useQueryClient();

    const { data, error, isLoading } = useInventory();

    const { mutate, isPending } = useMutation({
        mutationFn: (item: item) => removeItemFromInventory(item.id),
        onSuccess: (data) => {
            toast.success(
                <SuccessToast
                    action="Deleted"
                    name={data.item.item.name}
                    amount={data.amount}
                    image={data.item.item.image}
                />);
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
            <table className={`xs:table-xs sm:table-sm md:table-md table-compact table-pin-rows bg-base-100 ${isLoading ? 'flex-1' : ''}`}>
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
                                    <td className="p-2 xs:p-1 w-15 xl:w-20">
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
                                    <td className="p-1">
                                        <button className="btn btn-soft btn-error btn-sm md:btn-md" onClick={() => { mutate(item) }} disabled={isPending}>Delete</button>
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