import { useEffect, useState } from 'react';
import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { useSupabase } from "../contexts/SupabaseContext";
import { ToastContainer, toast } from 'react-toastify';
import PageCard from '../layouts/PageCard';
import ItemCategoryBadge from '../components/ItemCategoryBadge';

interface item {
    id: number
    image: {
        base64: string,
        type: string
    },
    name: string,
    category: string,
    value: number,
    description: string
}

interface ingredient {
    item: item,
    amount: number
}

interface recipe {
    item: item
    ingredients: ingredient[]
}

interface SupabaseItem {
    amount: number,
    item: {
        id: number,
        category: { name: string },
        description: string,
        image: { base64: string, type: string },
        name: string,
        value: number
    }
}

interface SupabaseRecipe {
    item: {
        id: number,
        category: { name: string },
        description: string,
        image: { base64: string, type: string },
        name: string,
        value: number
    }
    ingredient: {
        id: number,
        category: { name: string },
        description: string,
        image: { base64: string, type: string },
        name: string,
        value: number
    }
    amount: number,
}

type ItemCategory = 'weapon' | 'accessory' | 'consumable' | 'armor' | 'material';

const Crafting = () => {
    const { supabaseClient, supabaseUser } = useSupabase();
    const toastCraftError = (itemName: string, message: string) => {
        toast.error(`Error crafting ${itemName}: ${message}`, { position: 'top-center' })
    };

    const [loading, setLoading] = useState(true);
    const [loadingCraft, setLoadingCraft] = useState(false);
    const [recipes, setRecipes] = useState<recipe[]>([]);

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

    const insertInvetories = async (itemId: number, amount: number) => {
        if (supabaseClient) {
            const characterId = await getCharacterId();
            const { error } = await supabaseClient
                .from('inventories')
                .insert({
                    character: characterId,
                    item: itemId,
                    amount: amount
                })
            return error
        }
    }

    const updateInvetories = async (itemId: number, amount: number) => {
        if (supabaseClient) {
            const characterId = await getCharacterId();
            const { error } = await supabaseClient
                .from('inventories')
                .update({ amount: amount })
                .eq('character', characterId)
                .eq('item', itemId)
            return error
        }
    }

    const deleteFromInventories = async (itemId: number) => {
        if (supabaseClient) {
            const characterId = await getCharacterId();
            const { error } = await supabaseClient
                .from('inventories')
                .delete()
                .eq('character', characterId)
                .eq('item', itemId)
            return error
        }
    }

    const handleGetRecipes = async () => {
        setLoading(true);
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('recipes')
                .select(`
                item:items!recipes_item_fkey(
                    id,
                    name,
                    category:lk_item_categories(name),
                    value,
                    description,
                    image:lk_item_images(base64,type)
                ),
                ingredient:items!recipes_ingredient_fkey(
                    id,
                    name,
                    category:lk_item_categories(name),
                    value,
                    description,
                    image:lk_item_images(base64,type)
                ),
                amount
            `)
                .returns<SupabaseRecipe[]>();
            if (!error) {
                const recipes: recipe[] = [];
                data.map((recipe) => {
                    // Look for a recipe with an item id that matches the current recipe being processed
                    const recipeFound = recipes.find((r) => r.item.id === recipe.item.id);
                    // If the recipe is found, then we just add the ingredients of the current recipe being processed
                    if (recipeFound) {
                        recipeFound.ingredients.push(
                            {
                                item: {
                                    id: recipe.ingredient.id,
                                    image: {
                                        base64: recipe.ingredient.image.base64,
                                        type: recipe.ingredient.image.type
                                    },
                                    name: recipe.ingredient.name,
                                    category: recipe.ingredient.category.name,
                                    value: recipe.ingredient.value,
                                    description: recipe.ingredient.description
                                },
                                amount: recipe.amount
                            }
                        );
                    } else {
                        // Otherwise, add a new recipe to the list
                        recipes.push({
                            item: {
                                id: recipe.item.id,
                                image: {
                                    base64: recipe.item.image.base64,
                                    type: recipe.item.image.type
                                },
                                name: recipe.item.name,
                                category: recipe.item.category.name,
                                value: recipe.item.value,
                                description: recipe.item.description
                            },
                            ingredients: [{
                                amount: recipe.amount,
                                item: {
                                    id: recipe.ingredient.id,
                                    image: {
                                        base64: recipe.ingredient.image.base64,
                                        type: recipe.ingredient.image.type
                                    },
                                    name: recipe.ingredient.name,
                                    category: recipe.ingredient.category.name,
                                    value: recipe.ingredient.value,
                                    description: recipe.ingredient.description
                                }
                            }]
                        });
                    }

                })
                setRecipes(recipes);
            }
        }
        setLoading(false);
    }

    // Returns list of ingredients with updated amounts
    // If any ingredients are not found or there are not enough then return an empty list
    const findIngredients = async (data: SupabaseItem[], recipe: recipe) => {
        const updatedIngredients: ingredient[] = [];
        recipe.ingredients.forEach((ingredient) => {
            const inventoryIngredient = data.find((item) => item.item.id === ingredient.item.id);
            if (!inventoryIngredient) {
                toastCraftError(recipe.item.name, `Ingredient not found (${ingredient.item.name})`);
                // have to clear the returned array because otherwise it will still craft
                updatedIngredients.splice(0, updatedIngredients.length);
                return
            }
            if (inventoryIngredient.amount < ingredient.amount) {
                // If the player does not have enough of the ingredient return out
                toastCraftError(recipe.item.name, `Not enough ingredient (${ingredient.item.name})`);
                updatedIngredients.splice(0, updatedIngredients.length);
                return
            }
            updatedIngredients.push({
                amount: inventoryIngredient.amount - ingredient.amount,
                item: ingredient.item
            })
        })
        return updatedIngredients;
    }

    // Update the number of ingredients in the players inventory
    // If any updates fail then return false, otherwise return true if all successful
    const updateIngredients = async (ingredients: ingredient[]) => {
        ingredients.forEach(async (ingredient) => {
            if (ingredient.amount > 0) {
                // Update the number of ingredients in the player's inventory
                const error = await updateInvetories(ingredient.item.id, ingredient.amount);
                if (error) {
                    toast.error(`Error updating item: (${ingredient.item.name})`, { position: 'top-center' });
                    return false
                }
            } else {
                // Otherwise remove the item entirely
                const error = await deleteFromInventories(ingredient.item.id);
                if (error) {
                    toast.error(`Error removing item from inventory: (${ingredient.item.name})`, { position: 'top-center' });
                    return false
                }
            }
        })
        return true
    }

    const handleCraft = async (recipe: recipe) => {
        setLoadingCraft(true);
        // Lookup player inventory and determine if all of the ingredients exist
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
                .returns<SupabaseItem[]>();
            if (!error) {
                const updatedIngredients = await findIngredients(data, recipe);
                // If ingredients are not found or there are not enough then exit early
                if (updatedIngredients.length < 1) {
                    setLoadingCraft(false);
                    return
                }
                console.log('ingredients found ', updatedIngredients);
                // Remove ingredients from player inventory
                const ingredientsUpdated = await updateIngredients(updatedIngredients);

                // If any updates failed then exit early
                if (!ingredientsUpdated) {
                    setLoadingCraft(false);
                    return
                }
                // Add new recipe item to player inventory
                const craftedItem = data.find((item) => item.item.id === recipe.item.id);
                if (craftedItem) {
                    // If the item already exists just want to update the number of those items
                    const error = await updateInvetories(craftedItem.item.id, craftedItem.amount += 1);
                    if (error) {
                        toast.error(`Error updating item: (${craftedItem.item.name})`, { position: 'top-center' });
                        setLoadingCraft(false);
                        return
                    }
                } else {
                    // Otherwise insert it into their inventory
                    const error = await insertInvetories(recipe.item.id, 1);
                    if (error) {
                        toast.error(`Error adding item to inventory: (${recipe.item.name})`);
                        setLoadingCraft(false);
                        return
                    }
                }
                toast.success(
                    <div className='flex flex-row w-full items-center gap-3'>
                        <div>
                            Successfully crafted 1 x {recipe.item.name}!
                        </div>
                        <div className='w-6'>
                            <img src={`data:image/${recipe.item.image.type};base64,${recipe.item.image.base64}`} />
                        </div>
                    </div>,
                    {
                        position: 'top-center'
                    }
                )
            }
        }
        setLoadingCraft(false);
    }

    useEffect(() => {
        handleGetRecipes();
        // eslint-disable-next-line
    }, []);

    return (
        <PageCard title="Crafting" icon={faHammer} loading={loading}>
            <ToastContainer />
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
                        {recipes.map((recipe: recipe, id) => {
                            return (
                                <tr className="table-row items-baseline justify-baseline hover:bg-base-300 m-0" key={id}>
                                    <td className="m-0 w-1/16">
                                        <img src={`data:image/${recipe.item.image.type};base64,${recipe.item.image.base64}`} />
                                    </td>
                                    <td>
                                        {recipe.item.name}
                                    </td>
                                    <td>
                                        {/* <span className="badge badge-soft badge-primary badge-sm">
                                            {recipe.item.category}
                                        </span> */}
                                        <ItemCategoryBadge category={recipe.item.category as ItemCategory} />
                                    </td>
                                    <td>
                                        {recipe.item.value}
                                    </td>
                                    <td>
                                        {recipe.item.description}
                                    </td>
                                    <td>
                                        {recipe.ingredients.map((ingredient: ingredient, id) => {
                                            return (
                                                <div key={id}>
                                                    {ingredient.amount} x {ingredient.item.name}
                                                </div>
                                            )
                                        })}
                                    </td>
                                    <td>
                                        <button className="btn btn-soft btn-primary" onClick={() => handleCraft(recipe)}>
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