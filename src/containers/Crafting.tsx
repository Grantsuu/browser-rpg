import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faKitchenSet } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { clsx } from 'clsx';
import { item, ItemCategory, Recipe } from '../types/types';
import { getCraftingRecipes, postCraftRecipe } from "../lib/apiClient";
import { useConfetti } from '../contexts/ConfettiContext';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/Badges/ItemCategoryBadge';
import { useCharacter } from '../lib/stateMangers';
import SuccessToast from '../components/Toasts/SuccessToast';
import LevelUpToast from '../components/Toasts/LevelUpToast';

const Crafting = () => {
    const queryClient = useQueryClient();
    const { levelUpConfetti } = useConfetti();

    const { data: character } = useCharacter();

    const [activeTab, setActiveTab] = useState<string>('All');

    const { data, error, isLoading } = useQuery({
        queryKey: ['craftingRecipes'],
        queryFn: getCraftingRecipes,
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: { recipe: Recipe, amount: number }) => postCraftRecipe(variables.recipe.item.id, variables.amount),
        onSuccess: (data, variables: { recipe: Recipe, amount: number }) => {
            toast.success(
                <SuccessToast
                    action="Cooked"
                    name={variables.recipe.item.name}
                    amount={data.amount}
                    experience={data.experience}
                    image={variables.recipe.item.image}
                />
            );
            if (data.level) {
                levelUpConfetti();
                toast.info(
                    <LevelUpToast
                        level={data.level}
                        skill="Cooking"
                    />);
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
                <a
                    role="tab"
                    className={clsx({ 'tab tab-active': activeTab === 'All' }, { 'tab': activeTab !== 'All' })}
                    onClick={() => setActiveTab('All')}>
                    <div className="flex flex-row items-center gap-2">
                        <FontAwesomeIcon icon={faKitchenSet as IconProp} />
                        Cooking
                    </div>
                </a>
            </div>
            {/* Crafting table */}
            <table className={
                clsx(
                    'xs:table-xs sm:table-sm md:table-md table-compact table-pin-rows bg-base-100',
                    { 'flex-1': isLoading }
                )}>
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
                                    <td className="p-2 xs:p-1 w-1/8 sm:w-1/10 xl:w-1/18">
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
        </PageCard >
    )
}

export default Crafting;