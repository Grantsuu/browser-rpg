import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faShop } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from 'react-toastify';
import { item } from '../types/types';
import { toTitleCase } from '../utils/strings';
import { useCharacter, useInventory } from '../lib/stateMangers';
import { getItemCategories, getShopInventory, postBuyFromShop, postSellToShop } from '../lib/apiClient';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';


type ShopModes = 'buy' | 'sell';

const Shop = () => {
    const queryClient = useQueryClient();
    const [shopMode, setShopMode] = useState<ShopModes>('buy');
    const [activeTab, setActiveTab] = useState<string>('All');

    const { data: character } = useCharacter();
    const { data: inventory, error: inventoryError, isLoading: isInventoryLoading } = useInventory();

    const { data: shop, error: shopError, isLoading: isShopLoading } = useQuery({
        queryKey: ['shopInventory', { activeTab }],
        queryFn: async () => {
            if (activeTab === 'All') {
                return await getShopInventory();
            } else {
                return await getShopInventory(activeTab);
            }
        }
    })

    const { data: categories, error: categoriesError, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ['itemCategories'],
        queryFn: getItemCategories,
    })

    const { mutate: buy, isPending: isBuyPending } = useMutation({
        mutationFn: (variables: { item: item, amount: number }) => postBuyFromShop(variables.item.id, variables.amount),
        onSuccess: (_, variables: { item: item, amount: number }) => {
            toast.success(
                <div className='flex flex-row w-full items-center gap-3'>
                    <div>
                        Bought {variables.amount} x {variables.item.name}!
                    </div>
                    <div className='w-6'>
                        <img src={variables.item.image.base64} />
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
        mutationFn: (variables: { item: item, amount: number }) => postSellToShop(variables.item.id, variables.amount),
        onSuccess: (_, variables: { item: item, amount: number }) => {
            toast.success(
                <div className='flex flex-row w-full items-center gap-3'>
                    <div>
                        Sold {variables.amount} x {variables.item.name}!
                    </div>
                    <div className='w-6'>
                        <img src={variables.item.image.base64} />
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

    if (categoriesError) {
        toast.error(`Something went wrong fetching the item categories: ${(categoriesError as Error).message}`);
    }

    return (
        <PageCard title="Shop" icon={faShop}>
            <div className="flex flex-row items-center justify-between">
                <div className="join">
                    <input className="join-item btn btn-wide" type="radio" name="options" aria-label="Buy" defaultChecked onClick={() => setShopMode('buy')} />
                    <input className="join-item btn btn-wide" type="radio" name="options" aria-label="Sell" onClick={() => setShopMode('sell')} />
                </div>
                <div className="prose prose-lg">
                    <FontAwesomeIcon icon={faCoins as IconProp} className="mr-1" />
                    Gold: {character?.gold}
                </div>
            </div>
            <div role="tablist" className="tabs tabs-lift">
                <a role="tab" className={activeTab === 'All' ? `tab tab-active` : `tab`} onClick={() => setActiveTab('All')}>All</a>
                {isCategoriesLoading ? <span className="loading loading-spinner loading-sm"></span> :
                    categories?.map((category: string, id: number) => {
                        return (
                            <a role="tab" className={activeTab === category ? `tab tab-active` : `tab`} onClick={() => setActiveTab(category)} key={id}>{toTitleCase(category)}</a>
                        )
                    })}
            </div>
            <table className={`xs:table-xs sm:table-sm md:table-md table-compact table-pin-rows bg-base-100 ${(isInventoryLoading || isShopLoading) ? 'flex-1' : ''}`}>
                {/* head */}
                <thead>
                    <tr className="bg-secondary">
                        <th className="w-10"></th>
                        <th className="text-left p-1">Name</th>
                        <th className="hidden xs:table-cell text-left p-1">Category</th>
                        {shopMode === 'sell' && <th className="text-left p-1">Amount</th>}
                        <th className="text-left p-1">Value</th>
                        <th className="hidden xl:table-cell">Description</th>
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
                                        <td className="p-2 xs:p-1 w-15 xl:w-20">
                                            <img src={item.image.base64} />
                                        </td>
                                        <td className="p-1">
                                            {item.name}
                                        </td>
                                        <td className="hidden xs:table-cell p-1">
                                            <ItemCategoryBadge category={item.category} />
                                        </td>
                                        <td className="p-1">
                                            {item.value}
                                        </td>
                                        <td className="hidden xl:table-cell">
                                            {item.description}
                                        </td>
                                        <td>
                                            <div className="flex flex-row gap-1">
                                                <button className="btn btn-soft btn-primary" onClick={() => { buy({ item: item, amount: 1 }) }} disabled={isBuyPending}>
                                                    {isBuyPending ? <span className="loading loading-spinner loading-sm"></span> : 'Buy'}
                                                </button>
                                                <button className="btn btn-soft btn-primary" onClick={() => { buy({ item: item, amount: 5 }) }} disabled={isBuyPending}>
                                                    {isBuyPending ? <span className="loading loading-spinner loading-sm"></span> : 'Buy x5'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) :
                            inventory.map((item: item, id: number) => {
                                return (
                                    <tr className="table-row items-baseline justify-baseline hover:bg-base-300 m-0" key={id}>
                                        <td className="p-2 xs:p-1 w-15 xl:w-20">
                                            <img src={item.image.base64} />
                                        </td>
                                        <td>
                                            {item.name}
                                        </td>
                                        <td className="hidden xs:table-cell p-1">
                                            <ItemCategoryBadge category={item.category} />
                                        </td>
                                        <td>
                                            {item.amount}
                                        </td>
                                        <td>
                                            {Math.floor(item.value / 2)}
                                        </td>
                                        <td className="hidden xl:table-cell">
                                            {item.description}
                                        </td>
                                        <td>
                                            <div className="flex flex-col xs:flex-row gap-1">
                                                <button className="btn btn-soft btn-error btn-xs md:btn-sm" onClick={() => { sell({ item: item, amount: 5 }) }} disabled={isSellPending}>
                                                    {isSellPending ? <span className="loading loading-spinner loading-sm"></span> : 'Sell'}
                                                </button>
                                                <button className="btn btn-soft btn-error btn-xs md:btn-sm" onClick={() => { sell({ item: item, amount: 5 }) }} disabled={isSellPending}>
                                                    {isSellPending ? <span className="loading loading-spinner loading-sm"></span> : 'Sell x5'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                    }
                </tbody>
            </table>
        </PageCard>
    )
}

export default Shop;