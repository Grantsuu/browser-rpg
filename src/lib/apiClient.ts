const apiUrl = import.meta.env.VITE_API_URL;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// Need to get the JWT at time of API call because the session can change while logged in
const getJwt = () => {
    return JSON.parse(localStorage.getItem(`sb-${supabaseUrl.split('https://')[1].split('.')[0]}-auth-token`) as string)?.access_token;
}

// Auth

// Login
export const postLogin = async (email: string, password: string) => {
    const data = {
        email: email,
        password: password
    }
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body);
    }
    return await response.json();
}

// Logout
export const getLogout = async () => {
    const response = await fetch(`${apiUrl}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body);
    }
    return await response.json();
}


// Character

// GET

// Get Character Id
export const getCharacter = async () => {
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

// Get Character Levels
export const getCharacterLevels = async () => {
    const response = await fetch(`${apiUrl}/characters/levels`, {
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
export const getShopInventory = async (category?: string) => {
    const params = new URLSearchParams();
    if (category) {
        params.set('category', category.toString());
    }
    const response = await fetch(`${apiUrl}/shop` + (category ? `?${params.toString()}` : ''), {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

export const getItemCategories = async () => {
    const response = await fetch(`${apiUrl}/shop/categories`, {
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
export const postBuyFromShop = async (itemId: number, amount: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    params.set('amount', amount.toString());
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
export const postSellToShop = async (itemId: number, amount: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    params.set('amount', amount.toString());
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
export const postCraftRecipe = async (itemId: number, amount: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    params.set('amount', amount.toString());
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

// Farming

//GET

// Get farm plots
export const getFarmPlots = async () => {
    const response = await fetch(`${apiUrl}/farming`, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// Get cost of next farm plot
export const getFarmPlotCost = async () => {
    const response = await fetch(`${apiUrl}/farming/plot-cost`, {
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

// POST

// Buy new farm plot
export const postBuyPlot = async () => {
    const response = await fetch(`${apiUrl}/farming/buy`, {
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

// Plant seed in specified plot id
export const postPlantPlot = async (plotId: number, seedId: number) => {
    const params = new URLSearchParams();
    params.set('plot_id', plotId.toString());
    params.set('seed_id', seedId.toString());
    params.set('tz_offset', (new Date().getTimezoneOffset()).toString());
    const response = await fetch(`${apiUrl}/farming/plant?${params.toString()}`, {
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

// Harvest crop from specified plot id
export const postHarvestPlot = async (plotId: number) => {
    const params = new URLSearchParams();
    params.set('id', plotId.toString());
    const response = await fetch(`${apiUrl}/farming/harvest?${params.toString()}`, {
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

// PUT

// Cancel currently growing crop from specified plot id

export const putClearPlot = async (plotId: number) => {
    const params = new URLSearchParams();
    params.set('id', plotId.toString());
    const response = await fetch(`${apiUrl}/farming?${params.toString()}`, {
        method: 'PUT',
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

// Crops

// GET

// Get crops
export const getCrops = async () => {
    const response = await fetch(`${apiUrl}/crops`, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// Fishing

// GET

// Get fishing game state for user
export const getFishingGame = async () => {
    const response = await fetch(`${apiUrl}/fishing`, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// Get fishing areas
export const getFishingAreas = async () => {
    const response = await fetch(`${apiUrl}/fishing/areas`, {
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

// Start fishing game
export const postStartFishingGame = async (area: string) => {
    const params = new URLSearchParams();
    params.set('area', area);
    const response = await fetch(`${apiUrl}/fishing/start?${params.toString()}`, {
        method: 'PUT',
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

// PUT

// Update fishing game state
export const putUpdateFishingGame = async (row: number, col: number) => {
    const params = new URLSearchParams();
    params.set('row', row.toString());
    params.set('col', col.toString());
    const response = await fetch(`${apiUrl}/fishing?${params.toString()}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// Combat

// GET

export const getMonstersByArea = async (area: string) => {
    const params = new URLSearchParams();
    params.set('area', area);
    const response = await fetch(`${apiUrl}/combat/monsters?${params.toString()}`, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

export const getCombatByCharacterId = async () => {
    const response = await fetch(`${apiUrl}/combat`, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// PUT

export const putUpdateCombat = async (action: string, monsterId?: number) => {
    const params = new URLSearchParams();
    params.set('action', action);
    if (monsterId) {
        params.set('monster_id', monsterId.toString());
    }
    const response = await fetch(`${apiUrl}/combat?${params.toString()}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

export const putResetCombat = async () => {
    const response = await fetch(`${apiUrl}/combat/reset`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

// Training

// GET

export const getTrainingAreas = async () => {
    const response = await fetch(`${apiUrl}/combat/training/areas`, {
        headers: {
            'Authorization': `Bearer ${getJwt()}`
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

