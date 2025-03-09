import { recipe } from "../types/types";

const apiUrl = import.meta.env.VITE_API_URL;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const jwt = JSON.parse(localStorage.getItem(`sb-${supabaseUrl.split('https://')[1].split('.')[0]}-auth-token`) as string)?.access_token;

// Character

// Inventory

// GET
export const getCharacterInventory = async () => {
    const response = await fetch(`${apiUrl}/inventory`, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// Shop

// GET
export const getShopInventory = async () => {
    const response = await fetch(`${apiUrl}/shop`, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// Crafting

// GET
export const getCraftingRecipes = async () => {
    const response = await fetch(`${apiUrl}/crafting`, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// POST
export const postCraftRecipe = async (recipe: recipe) => {
    const response = await fetch(`${apiUrl}/crafting`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe)
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}