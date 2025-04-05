import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faKitchenSet } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { item, ItemCategory, Recipe } from '../types/types';
import { getCraftingRecipes, postCraftRecipe } from "../lib/apiClient";
import { useConfetti } from '../contexts/ConfettiContext';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';
import { useCharacter } from '../lib/stateMangers';

const Crafting = () => {
    const queryClient = useQueryClient();
    const { startConfetti, stopConfetti } = useConfetti();

    const { data: character } = useCharacter();

    const [activeTab, setActiveTab] = useState<string>('All');

    const { data, error, isLoading } = useQuery({
        queryKey: ['craftingRecipes'],
        queryFn: getCraftingRecipes,
    })

    const handleConfetti = () => {
        startConfetti();
        setTimeout(() => {
            stopConfetti();
        }, 10000);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: { recipe: Recipe, amount: number }) => postCraftRecipe(variables.recipe.item.id, variables.amount),
        onSuccess: (data, variables: { recipe: Recipe, amount: number }) => {
            toast.success(
                <div className='flex flex-row w-full items-center gap-3'>
                    <div>
                        Successfully crafted {data.amount} x {variables.recipe.item.name}!
                    </div>
                    <div className='w-6'>
                        <img src={variables.recipe.item.image.base64} alt={variables.recipe.item.image.alt} title={variables.recipe.item.image.alt} />
                    </div>
                </div>
            );
            toast.info(`Gained ${variables.recipe.experience * data.amount} cooking experience!`);
            if (data.level > 0) {
                handleConfetti();
                toast.success(`Congratulations! You've reached level ${data.level} Cooking!`);
            }
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['character'] });
        },
        onError: (error: Error, variables: { recipe: Recipe, amount: number }) => {
            toast.error(`Failed to craft ${variables.recipe.item.name}: ${(error as Error).message}`);
        }
    })

    if (error) {
        return toast.error(`Something went wrong fetching crafting recipes: ${(error as Error).message}`);
    }

    return (
        <PageCard title="Crafting" icon={faHammer}>
            {/* Crafting categories */}
            <div role="tablist" className="tabs tabs-lift">
                <a role="tab" className={activeTab === 'All' ? `tab tab-active` : `tab`} onClick={() => setActiveTab('All')}>
                    <div className="flex flex-row items-center gap-2">
                        <FontAwesomeIcon icon={faKitchenSet as IconProp} />
                        Cooking
                    </div>
                </a>
            </div>
            {/* Crafting table */}
            <table className={`xs:table-xs sm:table-sm md:table-md table-compact table-pin-rows bg-base-100 ${isLoading ? 'flex-1' : ''}`}>
                {/* head */}
                <thead>
                    <tr className="bg-secondary md:bg-secondary">
                        <th className="w-10"></th>
                        <th className="text-left p-1">Name</th>
                        <th className="text-left p-1">Level</th>
                        <th className="hidden sm:table-cell text-left p-1">Category</th>
                        <th className="hidden sm:table-cell text-left p-1">Value</th>
                        <th className="hidden xl:table-cell text-left">Description</th>
                        <th className="text-left p-1">Ingredients</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ?
                        <tr>
                            <td colSpan={8}>
                                <div className="flex items-center justify-center">
                                    <span className="loading loading-spinner loading-xl"></span>
                                </div>
                            </td>
                        </tr> :
                        data.sort((a: Recipe, b: Recipe) => a.required_level - b.required_level).map((recipe: Recipe, id: number) => {
                            return (
                                <tr className="table-row items-baseline justify-baseline hover:bg-base-300" key={id}>
                                    <td className="p-2 xs:p-1 w-15 xl:w-20">
                                        <img src={recipe.item.image.base64} alt={recipe.item.image.alt} title={recipe.item.image.alt} />
                                    </td>
                                    <td>
                                        {recipe.item.name}
                                    </td>
                                    <td>
                                        {recipe.required_level}
                                    </td>
                                    <td className="hidden sm:table-cell">
                                        <ItemCategoryBadge category={recipe.item.category as ItemCategory} />
                                    </td>
                                    <td className="hidden sm:table-cell">
                                        {recipe.item.value}
                                    </td>
                                    <td className="hidden xl:table-cell">
                                        {recipe.item.description}
                                    </td>
                                    <td>
                                        {recipe.ingredients.map((ingredient: item, id: number) => {
                                            return (
                                                <div key={id}>
                                                    {ingredient.amount} x {ingredient.name}
                                                </div>
                                            )
                                        })}
                                    </td>
                                    <td>
                                        <div className="flex flex-col xs:flex-row gap-1">
                                            <button className="btn btn-soft btn-primary btn-xs md:btn-sm" onClick={() => mutate({ recipe: recipe, amount: 1 })} disabled={isPending || (character?.cooking_level < recipe.required_level)}>
                                                {isPending ? <span className="loading loading-spinner loading-sm"></span> :
                                                    `Craft`}
                                            </button>
                                            <button className="btn btn-soft btn-primary btn-xs md:btn-sm" onClick={() => mutate({ recipe: recipe, amount: 5 })} disabled={isPending || (character?.cooking_level < recipe.required_level)}>
                                                {isPending ? <span className="loading loading-spinner loading-sm"></span> :
                                                    `Craft x5`}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </PageCard>
    )
}

export default Crafting;