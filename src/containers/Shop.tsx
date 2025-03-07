import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faShop } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from 'react-toastify';
import { useSupabase } from "../contexts/SupabaseContext";
import { item, SupabaseInventoryItem } from '../types/types';
import { getShopInventory } from '../lib/api-client';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';

type ShopModes = 'buy' | 'sell';


const Shop = () => {
    const { supabaseClient, supabaseUser } = useSupabase();

    const [loading, setLoading] = useState(false);
    const [shopMode, setShopMode] = useState<ShopModes>('buy');

    const [shopInventory, setShopInventory] = useState<item[]>([]);
    const [playerInventory, setPlayerInventory] = useState<item[]>([]);

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

    const handleGetShopInventory = async () => {
        setLoading(true);
        try {
            const inventory = await getShopInventory()
            setShopInventory(inventory);
        } catch (error) {
            toast.error(`Something went wrong fetching the Shop inventory: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    }

    const handleGetPlayerInventory = async () => {
        setLoading(true);
        if (supabaseClient) {
            const characterId = await getCharacterId();
            const { data, error } = await supabaseClient
                .from('inventories')
                .select(`
                amount,
                item:items(
                    id,
                    name,
                    category:lk_item_categories(name),
                    value,
                    description,
                    image:lk_item_images(base64,type)
                )
            `)
                .eq('character', characterId)
                .returns<SupabaseInventoryItem[]>();
            if (!error) {
                const items: item[] = [];
                data.map((item) => {
                    items.push({
                        id: item.item.id,
                        image: {
                            base64: item.item.image.base64,
                            type: item.item.image.type
                        },
                        name: item.item.name,
                        category: item.item.category.name,
                        value: item.item.value,
                        description: item.item.description,
                        amount: item.amount,
                    });
                })
                setPlayerInventory(items);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        if (shopMode === 'buy') {
            handleGetShopInventory();
        } else {
            handleGetPlayerInventory();
        }
        // eslint-disable-next-line
    }, [shopMode]);

    return (
        <PageCard title="Shop" icon={faShop} loading={loading}>
            <div className="flex flex-row items-center justify-between">
                <div className="join">
                    <input className="join-item btn" type="radio" name="options" aria-label="Buy" defaultChecked onClick={() => setShopMode('buy')} />
                    <input className="join-item btn" type="radio" name="options" aria-label="Sell" onClick={() => setShopMode('sell')} />
                </div>
                <div className="prose prose-lg">
                    <FontAwesomeIcon icon={faCoins as IconProp} className="mr-1" />
                    Gold: {0}
                </div>
            </div>
            <div className="overflow-y-scroll w-full h-full rounded border border-base-content/8 ">
                <table className="table table-pin-rows bg-base-100">
                    {/* head */}
                    <thead>
                        <tr className="bg-secondary-content">
                            <th></th>
                            <th>Name</th>
                            <th>Category</th>
                            {shopMode === 'sell' && <th>Amount</th>}
                            <th>Value</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {shopMode === 'buy' ?
                            shopInventory.map((item: item, id) => {
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
                                            {item.value}
                                        </td>
                                        <td>
                                            {item.description}
                                        </td>
                                        <td>
                                            <button className="btn btn-soft btn-success">Buy</button>
                                        </td>
                                    </tr>
                                )
                            }) :
                            playerInventory.map((item: item, id) => {
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
                                            {item.value / 2}
                                        </td>
                                        <td>
                                            {item.description}
                                        </td>
                                        <td>
                                            <button className="btn btn-soft btn-error">Sell</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </PageCard>
    )
}

export default Shop;