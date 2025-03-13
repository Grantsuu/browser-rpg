import { useEffect, useState } from 'react';
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { item } from '../types/types';
import { getCharacterInventory, removeItemFromInventory } from '../lib/api-client';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';

const Inventory = () => {
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState<item[]>([]);

    const handleGetInventory = async () => {
        setLoading(true);
        try {
            const inventory = await getCharacterInventory()
            setInventory(inventory);
        } catch (error) {
            toast.error(`Something went wrong fetching the Character's inventory: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    }

    const handleRemoveItem = async (itemId: number) => {
        setLoading(true);
        try {
            Promise.all(await removeItemFromInventory(itemId));
            handleGetInventory();
        } catch (error) {
            toast.error(`Something went wrong removing item from inventory: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetInventory();
        // eslint-disable-next-line
    }, []);

    return (
        <PageCard title="Inventory" icon={faBox}>
            <div className="flex flex-col overflow-y-scroll w-full h-full rounded border border-base-content/8 ">
                <table className={`table table-pin-rows bg-base-100 ${loading ? 'flex-1' : ''}`}>
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
                        {loading ?
                            <tr>
                                <td colSpan={7}>
                                    <div className="flex items-center justify-center">
                                        <span className="loading loading-spinner loading-xl"></span>
                                    </div>
                                </td>
                            </tr> :
                            inventory.map((item: item, id) => {
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
                                            <button className="btn btn-soft btn-error" onClick={() => { handleRemoveItem(item.id) }} disabled={loading}>Delete</button>
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