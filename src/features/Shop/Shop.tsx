import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faShop } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from 'react-toastify';
import type { Character, InventoryItem, ItemCategory, ShopItem } from '@src/types';
import { toTitleCase } from '@utils/strings';
import { useCharacter, useInventory } from '@lib/stateMangers';
import { getItemCategories, getShopInventory, postBuyFromShop, postSellToShop } from '@lib/apiClient';
import PageCard from '@layouts/PageCard';
import ItemCategoryBadge from '@components/Badges/ItemCategoryBadge';
import SuccessToast from '@components/Toasts/SuccessToast';

type ShopModes = 'buy' | 'sell';

const Shop = () => {
    const queryClient = useQueryClient();
    const [shopMode, setShopMode] = useState<ShopModes>('buy');
    const [activeTab, setActiveTab] = useState<ItemCategory | 'All'>('All');

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

    const { mutateAsync: buyItem, isPending: isBuyPending } = useMutation({
        mutationFn: (variables: { item: ShopItem, amount: number }) => postBuyFromShop(variables.item.item_id, variables.amount),
        onSuccess: (data, variables: { item: ShopItem, amount: number }) => {
            toast.success(
                <SuccessToast
                    action="Bought"
                    name={variables.item.name}
                    amount={variables.amount}
                    image={{ base64: variables.item.base64, alt: variables.item.name }}
                    extendedMessage={<> for <span className="text-red-600"><b>{data.goldSpent}</b></span> gold.</>}
                />
            )
            queryClient.setQueryData(['inventory'], (oldData: InventoryItem[]) => {
                const itemIndex = oldData.findIndex((i) => i.item_id === variables.item.item_id);
                if (itemIndex !== -1) {
                    // If the item is already in the inventory, just increase the amount
                    oldData[itemIndex].amount = data.inventory.amount;
                } else {
                    // If the item is not in the inventory, add it
                    const newItem = {
                        ...variables.item,
                        amount: variables.amount
                    }
                    oldData.push(newItem);
                }
                return oldData;
            })
            queryClient.setQueryData(['character'], (oldData: Character) => {
                return {
                    ...oldData,
                    gold: data.characterGold
                }
            })
        },
        onError: (error: Error) => {
            toast.error(`Failed to buy item from shop: ${(error as Error).message}`);
        }
    })

    const { mutateAsync: sellItem, isPending: isSellPending } = useMutation({
        mutationFn: (variables: { item: InventoryItem, amount: number }) => postSellToShop(variables.item.item_id, variables.amount),
        onSuccess: (data, variables: { item: InventoryItem, amount: number }) => {
            toast.success(
                <SuccessToast
                    action="Sold"
                    name={variables.item.name}
                    amount={variables.amount}
                    image={{ base64: variables.item.base64, alt: variables.item.alt }}
                    extendedMessage={<> for <span className="text-green-600"><b>{data.goldGained}</b></span> gold.</>}
                />
            )
            queryClient.setQueryData(['inventory'], (oldData: InventoryItem[]) => {
                const itemIndex = oldData.findIndex((i) => i.item_id === variables.item.item_id);
                // If the item is already in the inventory, just decrease the amount
                if (itemIndex !== -1) {
                    if (data.item) {
                        oldData[itemIndex].amount = data.item.amount;
                    } else {
                        oldData.splice(itemIndex, 1);
                    }
                }
                return oldData;
            })
            queryClient.setQueryData(['character'], (oldData: Character) => {
                return {
                    ...oldData,
                    gold: data.characterGold
                }
            })
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
                    categories?.map((category: ItemCategory, id: number) => {
                        return (
                            <a role="tab" className={activeTab === category ? `tab tab-active` : `tab`} onClick={() => setActiveTab(category)} key={id}>{toTitleCase(category)}</a>
                        )
                    })}
            </div>
            <table className={`xs:table-xs sm:table-sm md:table-md table-compact table-pin-rows bg-base-100 ${(isInventoryLoading || isShopLoading) ? 'flex-1' : ''}`}>
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
                        // Buy Mode
                        shopMode === 'buy' ?
                            shop.sort((a: ShopItem, b: ShopItem) => a.item_id - b.item_id).map((item: ShopItem, id: number) => {
                                return (
                                    <tr className="table-row items-baseline justify-baseline hover:bg-base-300 m-0" key={id}>
                                        <td className="p-2 xs:p-1 w-1/8 sm:w-1/10 xl:w-1/18">
                                            <img src={item.base64} alt={item.alt} title={item.alt} />
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
                                                <button className="btn btn-soft btn-primary" onClick={async () => { buyItem({ item: item, amount: 1 }) }} disabled={isBuyPending}>
                                                    {isBuyPending ? <span className="loading loading-spinner loading-sm"></span> : 'Buy'}
                                                </button>
                                                <button className="btn btn-soft btn-primary" onClick={async () => { buyItem({ item: item, amount: 5 }) }} disabled={isBuyPending}>
                                                    {isBuyPending ? <span className="loading loading-spinner loading-sm"></span> : 'Buy x5'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) :
                            // Sell Mode
                            inventory.sort((a: InventoryItem, b: InventoryItem) => a.item_id - b.item_id).map((item: InventoryItem, index: number) => {
                                return (
                                    <tr className="table-row items-baseline justify-baseline hover:bg-base-300 m-0" key={index}>
                                        <td className="p-2 xs:p-1 w-1/8 sm:w-1/10 xl:w-1/18">
                                            <img src={item.base64} alt={item.alt} title={item.alt} />
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
                                                <button className="btn btn-soft btn-error btn-xs md:btn-sm" onClick={async () => { sellItem({ item: item, amount: 1 }) }} disabled={isSellPending}>
                                                    {isSellPending ? <span className="loading loading-spinner loading-sm"></span> : 'Sell'}
                                                </button>
                                                <button className="btn btn-soft btn-error btn-xs md:btn-sm" onClick={async () => { sellItem({ item: item, amount: 5 }) }} disabled={isSellPending}>
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