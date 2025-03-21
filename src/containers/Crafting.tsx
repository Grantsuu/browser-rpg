import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { item, Recipe } from '../types/types';
import { getCraftingRecipes, postCraftRecipe } from "../lib/apiClient"
import { ItemCategory } from '../types/types';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';

const Crafting = () => {
    const queryClient = useQueryClient();
    const { data, error, isLoading } = useQuery({
        queryKey: ['craftingRecipes'],
        queryFn: getCraftingRecipes,
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (recipe: Recipe) => postCraftRecipe(recipe.item.id),
        onSuccess: (_, variables: Recipe) => {
            toast.success(
                <div className='flex flex-row w-full items-center gap-3'>
                    <div>
                        Successfully crafted 1 x {variables.item.name}!
                    </div>
                    <div className='w-6'>
                        <img src={variables.item.image.base64} />
                    </div>
                </div>
            );
            toast.info(`Gained ${variables.experience} cooking experience!`);
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['character'] });
        },
        onError: (error: Error, variables: Recipe) => {
            toast.error(`Failed to craft ${variables.item.name}: ${(error as Error).message}`);
        }
    })

    if (error) {
        return toast.error(`Something went wrong fetching crafting recipes: ${(error as Error).message}`);
    }

    return (
        <PageCard title="Crafting" icon={faHammer}>
            <div className="flex flex-col overflow-y-scroll w-full h-full rounded border border-base-content/8">
                <table className={`table table-pin-rows bg-base-100 ${isLoading ? 'flex-1' : ''}`}>
                    {/* head */}
                    <thead>
                        <tr className="bg-secondary">
                            <th></th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Value</th>
                            <th>Description</th>
                            <th>Ingredients</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ?
                            <tr>
                                <td colSpan={7}>
                                    <div className="flex items-center justify-center">
                                        <span className="loading loading-spinner loading-xl"></span>
                                    </div>
                                </td>
                            </tr> :
                            data.map((recipe: Recipe, id: number) => {
                                return (
                                    <tr className="flex table-row items-baseline justify-baseline hover:bg-base-300 m-0" key={id}>
                                        <td className="m-0 w-1/16">
                                            <img src={recipe.item.image.base64} />
                                        </td>
                                        <td>
                                            {recipe.item.name}
                                        </td>
                                        <td>
                                            <ItemCategoryBadge category={recipe.item.category as ItemCategory} />
                                        </td>
                                        <td>
                                            {recipe.item.value}
                                        </td>
                                        <td>
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
                                            <button className="btn btn-soft btn-primary" onClick={() => mutate(recipe)} disabled={isPending}>
                                                {isPending ? <span className="loading loading-spinner loading-sm"></span> :
                                                    `Craft`}
                                            </button>
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

export default Crafting;