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
    const [buyLoading, setBuyLoading] = useState(false);
    const [sellLoading, setSellLoading] = useState(false);
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

    const handleBuy = async (item: item) => {
        setBuyLoading(true);
        try {
            await postBuyFromShop(item.id);
            toast.success(
                <div className='flex flex-row w-full items-center gap-3'>
                    <div>
                        Bought 1 x {item.name}!
                    </div>
                    <div className='w-6'>
                        <img src={item.image.base64} />
                    </div>
                </div>
            )
        } catch (error) {
            toast.error(`Something went wrong buying from the shop: ${(error as Error).message}`);
        } finally {
            handleGetGold();
            setBuyLoading(false);
        }
    }

    const handleSell = async (item: item) => {
        setSellLoading(true);
        try {
            await postSellToShop(item.id);
            toast.success(
                <div className='flex flex-row w-full items-center gap-3'>
                    <div>
                        Sold 1 x {item.name}!
                    </div>
                    <div className='w-6'>
                        <img src={item.image.base64} />
                    </div>
                </div>
            )
        } catch (error) {
            toast.error(`Something went wrong selling to the shop: ${(error as Error).message}`);
        } finally {
            await handleGetGold();
            await handleGetPlayerInventory();
            setSellLoading(false);
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
        <PageCard title="Shop" icon={faShop}>
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
            <div className="flex flex-col overflow-y-scroll w-full h-full rounded border border-base-content/8 ">
                <table className={`table table-pin-rows bg-base-100 ${loading ? 'flex-1' : ''}`}>
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
                        {loading ?
                            <tr>
                                <td colSpan={7}>
                                    <div className="flex items-center justify-center">
                                        <span className="loading loading-spinner loading-xl"></span>
                                    </div>
                                </td>
                            </tr> :
                            shopMode === 'buy' ?
                                shopInventory.map((item: item, id) => {
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
                                                {item.value}
                                            </td>
                                            <td>
                                                {item.description}
                                            </td>
                                            <td>
                                                <button className="btn btn-soft btn-success" onClick={() => { handleBuy(item) }} disabled={buyLoading}>
                                                    {buyLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Buy'}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }) :
                                playerInventory.map((item: item, id) => {
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
                                                {item.value / 2}
                                            </td>
                                            <td>
                                                {item.description}
                                            </td>
                                            <td>
                                                <button className="btn btn-soft btn-error" onClick={() => { handleSell(item) }} disabled={sellLoading}>
                                                    {sellLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Sell'}
                                                </button>
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