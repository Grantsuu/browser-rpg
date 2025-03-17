import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faShop } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from 'react-toastify';
import { item } from '../types/types';
import { useCharacter, useInventory } from '../lib/stateMangers';
import { getShopInventory, postBuyFromShop, postSellToShop } from '../lib/apiClient';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';

type ShopModes = 'buy' | 'sell';

const Shop = () => {
    const queryClient = useQueryClient();
    const [shopMode, setShopMode] = useState<ShopModes>('buy');

    const { data: character } = useCharacter();
    const { data: inventory, error: inventoryError, isLoading: isInventoryLoading } = useInventory();
    const { data: shop, error: shopError, isLoading: isShopLoading } = useQuery({
        queryKey: ['shopInventory'],
        queryFn: getShopInventory,
    })

    const { mutate: buy, isPending: isBuyPending } = useMutation({
        mutationFn: (item: item) => postBuyFromShop(item.id),
        onSuccess: (_, variables: item) => {
            toast.success(
                <div className='flex flex-row w-full items-center gap-3'>
                    <div>
                        Bought 1 x {variables.name}!
                    </div>
                    <div className='w-6'>
                        <img src={variables.image.base64} />
                    </div>
                </div>
            )
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['character'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to buy item from shop: ${(error as Error).message}`);
        }
    })

    const { mutate: sell, isPending: isSellPending } = useMutation({
        mutationFn: (item: item) => postSellToShop(item.id),
        onSuccess: (_, variables: item) => {
            toast.success(
                <div className='flex flex-row w-full items-center gap-3'>
                    <div>
                        Sold 1 x {variables.name}!
                    </div>
                    <div className='w-6'>
                        <img src={variables.image.base64} />
                    </div>
                </div>
            )
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['character'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to sell item to shop: ${(error as Error).message}`);
        }
    })

    if (inventoryError) {
        toast.error(`Something went wrong fetching the Character's inventory: ${(inventoryError as Error).message}`);
    }

    if (shopError) {
        toast.error(`Something went wrong fetching the Shop inventory: ${(shopError as Error).message}`);
    }

    return (
        <PageCard title="Shop" icon={faShop}>
            <div className="flex flex-row items-center justify-between">
                <div className="join">
                    <input className="join-item btn" type="radio" name="options" aria-label="Buy" defaultChecked onClick={() => setShopMode('buy')} />
                    <input className="join-item btn" type="radio" name="options" aria-label="Sell" onClick={() => setShopMode('sell')} />
                </div>
                <div className="prose prose-lg">
                    <FontAwesomeIcon icon={faCoins as IconProp} className="mr-1" />
                    Gold: {character?.gold}
                </div>
            </div>
            <div className="flex flex-col overflow-y-scroll w-full h-full rounded border border-base-content/8 ">
                <table className={`table table-pin-rows bg-base-100 ${(isInventoryLoading || isShopLoading) ? 'flex-1' : ''}`}>
                    {/* head */}
                    <thead>
                        <tr className="bg-secondary">
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
                        {(isInventoryLoading || isShopLoading) ?
                            <tr>
                                <td colSpan={7}>
                                    <div className="flex items-center justify-center">
                                        <span className="loading loading-spinner loading-xl"></span>
                                    </div>
                                </td>
                            </tr> :
                            shopMode === 'buy' ?
                                shop.map((item: item, id: number) => {
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
                                                <button className="btn btn-soft btn-primary" onClick={() => { buy(item) }} disabled={isBuyPending}>
                                                    {isBuyPending ? <span className="loading loading-spinner loading-sm"></span> : 'Buy'}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }) :
                                inventory.map((item: item, id: number) => {
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
                                                <button className="btn btn-soft btn-error" onClick={() => { sell(item) }} disabled={isSellPending}>
                                                    {isSellPending ? <span className="loading loading-spinner loading-sm"></span> : 'Sell'}
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