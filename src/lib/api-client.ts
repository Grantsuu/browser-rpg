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

// DELETE
export const removeItemFromInventory = async (itemId: number, amount?: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    if (amount) {
        params.set('amount', amount.toString());
    }
    const response = await fetch(`${apiUrl}/inventory?${params.toString()}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body);
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
export const postCraftRecipe = async (itemId: number) => {
    const params = new URLSearchParams({ id: itemId.toString() }).toString();
    const response = await fetch(`${apiUrl}/crafting?${params}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
    if (!response.ok) {
        // Crafting endpoint returns reason why craft failed so propagate error message
        const body = await response.json();
        throw new Error(body);
    }
    return await response.json();
}