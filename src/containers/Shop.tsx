import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faShop } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from 'react-toastify';
import { item } from '../types/types';
import { getCharacterGold, getCharacterInventory, getShopInventory, postBuyFromShop, postSellToShop } from '../lib/api-client';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';

type ShopModes = 'buy' | 'sell';

const Shop = () => {
    const [loading, setLoading] = useState(false);
    const [shopMode, setShopMode] = useState<ShopModes>('buy');

    const [playerGold, setPlayerGold] = useState(0);
    const [shopInventory, setShopInventory] = useState<item[]>([]);
    const [playerInventory, setPlayerInventory] = useState<item[]>([]);

    const handleGetGold = async () => {
        try {
            const gold = await getCharacterGold();
            setPlayerGold(gold);
        } catch (error) {
            toast.error(`Something went wrong fetching the player's gold: ${(error as Error).message}`);
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
        try {
            const inventory = await getCharacterInventory()
            setPlayerInventory(inventory);
        } catch (error) {
            toast.error(`Something went wrong fetching the Character's inventory: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    }

    const handleBuy = async (itemId: number) => {
        setLoading(true);
        try {
            await postBuyFromShop(itemId);
        } catch (error) {
            toast.error(`Something went wrong buying from the shop: ${(error as Error).message}`);
        } finally {
            handleGetGold();
            setLoading(false);
        }
    }

    const handleSell = async (itemId: number) => {
        setLoading(true);
        try {
            await postSellToShop(itemId);
        } catch (error) {
            toast.error(`Something went wrong selling to the shop: ${(error as Error).message}`);
        } finally {
            await handleGetGold();
            await handleGetPlayerInventory();
            setLoading(false);
        }
    }

    useEffect(() => {
        if (shopMode === 'buy') {
            handleGetShopInventory();
        } else {
            handleGetPlayerInventory();
        }
    }, [shopMode]);

    useEffect(() => {
        handleGetGold();
    }, [])

    return (
        <PageCard title="Shop" icon={faShop} loading={loading}>
            <div className="flex flex-row items-center justify-between">
                <div className="join">
                    <input className="join-item btn" type="radio" name="options" aria-label="Buy" defaultChecked onClick={() => setShopMode('buy')} />
                    <input className="join-item btn" type="radio" name="options" aria-label="Sell" onClick={() => setShopMode('sell')} />
                </div>
                <div className="prose prose-lg">
                    <FontAwesomeIcon icon={faCoins as IconProp} className="mr-1" />
                    Gold: {playerGold}
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
                                            <button className="btn btn-soft btn-success" onClick={() => { handleBuy(item.id) }} disabled={loading}>Buy</button>
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
                                            <button className="btn btn-soft btn-error" onClick={() => { handleSell(item.id) }} disabled={loading}>Sell</button>
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