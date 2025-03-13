const apiUrl = import.meta.env.VITE_API_URL;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// Need to get the JWT at time of API call because the session can change while logged in
const getJwt = () => {
    return JSON.parse(localStorage.getItem(`sb-${supabaseUrl.split('https://')[1].split('.')[0]}-auth-token`) as string)?.access_token;
}


// Character

// GET

// Get Character Id
export const getCharacterId = async () => {
    const response = await fetch(`${apiUrl}/characters`, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// Get Gold
export const getCharacterGold = async () => {
    const response = await fetch(`${apiUrl}/characters/gold`, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

export const postCreateCharacter = async (name: string) => {
    const params = new URLSearchParams();
    params.set('name', name);
    const response = await fetch(`${apiUrl}/characters?${params.toString()}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body);
    }
    return await response.json();
}

// Inventory

// GET
export const getCharacterInventory = async () => {
    const response = await fetch(`${apiUrl}/inventory`, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
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
            'Authorization': `Bearer ${getJwt()}`
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
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// POST

// Buy
export const postBuyFromShop = async (itemId: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    params.set('amount', '1');
    const response = await fetch(`${apiUrl}/shop/buy?${params.toString()}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body);
    }
    return await response.json();
}

// Sell
export const postSellToShop = async (itemId: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    params.set('amount', '1');
    const response = await fetch(`${apiUrl}/shop/sell?${params.toString()}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body);
    }
    return await response.json();
}

// Crafting

// GET
export const getCraftingRecipes = async () => {
    const response = await fetch(`${apiUrl}/crafting`, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// POST
export const postCraftRecipe = async (itemId: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    const response = await fetch(`${apiUrl}/crafting?${params.toString()}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        // Crafting endpoint returns reason why craft failed so propagate error message
        const body = await response.json();
        throw new Error(body);
    }
    return await response.json();
}