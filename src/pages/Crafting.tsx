import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useSupabase } from "../contexts/SupabaseContext";

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

const Crafting = () => {
    const { supabaseClient, supabaseUser } = useSupabase();

    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState<recipe[]>([]);

    const handleGetRecipes = async () => {
        setLoading(true);
        if (supabaseClient && supabaseUser) {
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
                    if (recipes.find((r) => r.item.id === recipe.item.id)) {
                        recipes.find((r) => r.item.id === recipe.item.id)?.ingredients.push(
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

    useEffect(() => {
        handleGetRecipes();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {loading ? <span className="loading loading-spinner loading-xl"></span> :
                <div className="card w-full h-full bg-base-100 shadow-md">
                    <div className="card-body min-w-full max-h-full">
                        <div className="prose">
                            <h1>
                                <FontAwesomeIcon icon={faHammer as IconProp} /> Crafting
                            </h1>
                        </div>
                        <div className="divider"></div>
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
                                                    <span className="badge badge-soft badge-primary badge-sm">
                                                        {recipe.item.category}
                                                    </span>
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
                                                    <button className="btn btn-soft btn-primary">Craft</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default Crafting;