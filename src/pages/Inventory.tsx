import { useEffect, useState } from 'react';
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { useSupabase } from "../contexts/SupabaseContext";
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';

interface SupabaseItem {
    amount: number,
    item: {
        category: { name: string },
        description: string,
        image: { base64: string, type: string },
        name: string,
        value: number
    }
}

interface item {
    image: {
        base64: string,
        type: string
    },
    name: string,
    category: string,
    amount: number,
    value: number,
    description: string
}

const Inventory = () => {
    const { supabaseClient, supabaseUser } = useSupabase();

    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState<item[]>([]);

    const getCharacterId = async () => {
        if (supabaseClient && supabaseUser) {
            const { data, error } = await supabaseClient
                .from('characters')
                .select('id')
                .eq('user', supabaseUser.id)
            if (error) {
                return ''
            }
            return data[0].id
        }
    }

    const handleGetInventory = async () => {
        setLoading(true);
        if (supabaseClient && supabaseUser) {
            const characterId = await getCharacterId();
            const { data, error } = await supabaseClient
                .from('inventories')
                .select(`
                amount,
                item:items(
                    name,
                    category:lk_item_categories(name),
                    value,
                    description,
                    image:lk_item_images(base64,type)
                )
            `)
                .eq('character', characterId)
                .returns<SupabaseItem[]>();
            if (!error) {
                const items: item[] = [];
                data.map((item) => {
                    items.push({
                        image: {
                            base64: item.item.image.base64,
                            type: item.item.image.type
                        },
                        name: item.item.name,
                        category: item.item.category.name,
                        amount: item.amount,
                        value: item.item.value,
                        description: item.item.description
                    });
                })
                setInventory(items);
            }
        }
        setLoading(false);
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