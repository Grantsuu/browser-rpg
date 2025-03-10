import { useEffect, useState } from 'react';
import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { item, recipe } from '../types/types';
import { getCraftingRecipes, postCraftRecipe } from "../lib/api-client"
import { ItemCategory } from '../types/types';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';

const Crafting = () => {

    const [loading, setLoading] = useState(true);
    const [loadingCraft, setLoadingCraft] = useState(false);
    const [craftingRecipes, setCraftingRecipes] = useState<recipe[]>([]);

    const handleGetCraftingRecipes = async () => {
        setLoading(true);
        try {
            const inventory = await getCraftingRecipes()
            setCraftingRecipes(inventory);
        } catch (error) {
            toast.error(`Something went wrong fetching the Character's inventory: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    }

    const handleCraftRecipe = async (recipe: recipe) => {
        setLoadingCraft(true);
        try {
            await postCraftRecipe(recipe.item.id);
            toast.success(
                <div className='flex flex-row w-full items-center gap-3'>
                    <div>
                        Successfully crafted 1 x {recipe.item.name}!
                    </div>
                    <div className='w-6'>
                        <img src={`data:image/${recipe.item.image.type};base64,${recipe.item.image.base64}`} />
                    </div>
                </div>
            )
        } catch (error) {
            console.log(error);
            toast.error(`Failed to craft ${recipe.item.name}: ${(error as Error).message}`);
        } finally {
            setLoadingCraft(false);
        }
    }


    useEffect(() => {
        handleGetCraftingRecipes();
    }, []);

    return (
        <PageCard title="Crafting" icon={faHammer} loading={loading}>
            <div className="overflow-y-scroll w-full h-full rounded border border-base-content/8 ">
                <table className="table table-pin-rows bg-base-100">
                    {/* head */}
                    <thead>
                        <tr className="bg-secondary-content">
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
                        {craftingRecipes.map((recipe: recipe, id) => {
                            return (
                                <tr className="table-row items-baseline justify-baseline hover:bg-base-300 m-0" key={id}>
                                    <td className="m-0 w-1/16">
                                        <img src={`data:image/${recipe.item.image.type};base64,${recipe.item.image.base64}`} />
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
                                        {recipe.ingredients.map((ingredient: item, id) => {
                                            return (
                                                <div key={id}>
                                                    {ingredient.amount} x {ingredient.name}
                                                </div>
                                            )
                                        })}
                                    </td>
                                    <td>
                                        <button className="btn btn-soft btn-primary" onClick={() => handleCraftRecipe(recipe)} disabled={loadingCraft}>
                                            {loadingCraft ? <span className="loading loading-spinner loading-sm"></span> :
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