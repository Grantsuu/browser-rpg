import { useEffect, useState } from 'react';
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { item } from '../types/types';
import { getCharacterInventory } from '../lib/api-client';
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

    useEffect(() => {
        handleGetInventory();
        // eslint-disable-next-line
    }, []);

    return (
        <PageCard title="Inventory" icon={faBox} loading={loading}>
            <div className="overflow-y-scroll w-full h-full rounded border border-base-content/8 ">
                <table className="table table-pin-rows bg-base-100">
                    {/* head */}
                    <thead>
                        <tr className="bg-secondary-content">
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
                        {inventory.map((item: item, id) => {
                            return (
                                <tr className="table-row items-baseline justify-baseline hover:bg-base-300 m-0" key={id}>
                                    <td className="m-0 w-1/16">
                                        <img src={`data:image/${item.image.type};base64,${item.image.base64}`} />
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
                                        <button className="btn btn-soft btn-error">Delete</button>
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