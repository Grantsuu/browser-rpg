const apiUrl = import.meta.env.VITE_API_URL;

const fetchApi = async (url: string, options?: RequestInit) => {
    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Redirect to login page if unauthorized
                window.location.href = '/login';
            }
            const errorBody = await response.json();
            // Check if the error body contains a message
            if (errorBody) {
                throw new Error(errorBody);
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }

        // Attempt to parse the response body as JSON
        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            // Handle errors during JSON parsing
            throw new Error(`JSON parsing error: ${(jsonError as Error).message}`);
        }
    } catch (error) {
        // Handle network errors or other exceptions
        console.error("Fetch error:", error);
        throw error; // Re-throw to propagate the error if needed
    }
}

// Auth

// Login
export const postLogin = async (email: string, password: string) => {
    const data = {
        email: email,
        password: password
    }
    try {
        return await fetchApi(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Logout
export const getLogout = async () => {
    try {
        return await fetchApi(`${apiUrl}/auth/logout`, {
            method: 'GET'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Register
export const postRegister = async (email: string, password: string, redirectUrl: string) => {
    const data = {
        email: email,
        password: password,
        redirectUrl: redirectUrl
    }
    try {
        return await fetchApi(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Reset password request
export const postResetPassword = async (email: string, redirectUrl: string) => {
    const data = {
        email: email,
        redirectUrl: redirectUrl
    }
    try {
        return await fetchApi(`${apiUrl}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Update password
export const postUpdatePassword = async (password: string) => {
    const data = {
        password: password
    }
    try {
        return await fetchApi(`${apiUrl}/auth/update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Character

// GET

// Get Character
export const getCharacter = async () => {
    try {
        return await fetchApi(`${apiUrl}/characters`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Get Character Levels
export const getCharacterLevels = async () => {
    try {
        return await fetchApi(`${apiUrl}/characters/levels`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Get Character Combat Stats
export const getCharacterCombatStats = async () => {
    try {
        return await fetchApi(`${apiUrl}/characters/combat`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// POST

export const postCreateCharacter = async (name: string) => {
    const params = new URLSearchParams();
    params.set('name', name);
    try {
        return await fetchApi(`${apiUrl}/characters?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Item

// PUT

// Use item
export const putUseItem = async (itemId: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    try {
        return await fetchApi(`${apiUrl}/items/use?${params.toString()}`, {
            method: 'PUT'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}


// Inventory

// GET
export const getCharacterInventory = async () => {
    try {
        return await fetchApi(`${apiUrl}/inventory`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// DELETE
export const removeItemFromInventory = async (itemId: number, amount?: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    if (amount) {
        params.set('amount', amount.toString());
    }
    try {
        return await fetchApi(`${apiUrl}/inventory?${params.toString()}`, {
            method: 'DELETE'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Shop

// GET
export const getShopInventory = async (category?: string) => {
    const params = new URLSearchParams();
    if (category) {
        params.set('category', category.toString());
    }
    try {
        return await fetchApi(`${apiUrl}/shop?${params.toString()}`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export const getItemCategories = async () => {
    try {
        return await fetchApi(`${apiUrl}/shop/categories`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// POST

// Buy
export const postBuyFromShop = async (itemId: number, amount: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    params.set('amount', amount.toString());
    try {
        return await fetchApi(`${apiUrl}/shop/buy?${params.toString()}`, {
            method: 'POST'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Sell
export const postSellToShop = async (itemId: number, amount: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    params.set('amount', amount.toString());
    try {
        return await fetchApi(`${apiUrl}/shop/sell?${params.toString()}`, {
            method: 'POST'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Crafting

// GET
export const getCraftingRecipes = async () => {
    try {
        return await fetchApi(`${apiUrl}/crafting`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// POST
export const postCraftRecipe = async (itemId: number, amount: number) => {
    const params = new URLSearchParams();
    params.set('id', itemId.toString());
    params.set('amount', amount.toString());
    try {
        return await fetchApi(`${apiUrl}/crafting?${params.toString()}`, {
            method: 'POST'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Farming

//GET

// Get farm plots
export const getFarmPlots = async () => {
    try {
        return await fetchApi(`${apiUrl}/farming`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Get cost of next farm plot
export const getFarmPlotCost = async () => {
    try {
        return await fetchApi(`${apiUrl}/farming/plot-cost`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// POST

// Buy new farm plot
export const postBuyPlot = async () => {
    try {
        return await fetchApi(`${apiUrl}/farming/buy`, {
            method: 'POST'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Plant seed in specified plot id
export const postPlantPlot = async (plotId: number, seedId: number) => {
    const params = new URLSearchParams();
    params.set('plot_id', plotId.toString());
    params.set('seed_id', seedId.toString());
    params.set('tz_offset', (new Date().getTimezoneOffset()).toString());
    try {
        return await fetchApi(`${apiUrl}/farming/plant?${params.toString()}`, {
            method: 'POST'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Harvest crop from specified plot id
export const postHarvestPlot = async (plotId: number) => {
    const params = new URLSearchParams();
    params.set('id', plotId.toString());
    try {
        return await fetchApi(`${apiUrl}/farming/harvest?${params.toString()}`, {
            method: 'POST'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// PUT

// Cancel currently growing crop from specified plot id

export const putClearPlot = async (plotId: number) => {
    const params = new URLSearchParams();
    params.set('id', plotId.toString());
    try {
        return await fetchApi(`${apiUrl}/farming?${params.toString()}`, {
            method: 'PUT'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Crops

// GET

// Get crops
export const getCrops = async () => {
    try {
        return await fetchApi(`${apiUrl}/crops`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Fishing

// GET

// Get fishing game state for user
export const getFishingGame = async () => {
    try {
        return await fetchApi(`${apiUrl}/fishing`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Get fishing areas
export const getFishingAreas = async () => {
    try {
        return await fetchApi(`${apiUrl}/fishing/areas`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// PUT

// Start fishing game
export const putStartFishingGame = async (area: string) => {
    const params = new URLSearchParams();
    params.set('area', area);
    try {
        return await fetchApi(`${apiUrl}/fishing/start?${params.toString()}`, {
            method: 'PUT'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Update fishing game state
export const putUpdateFishingGame = async (row: number, col: number) => {
    const params = new URLSearchParams();
    params.set('row', row.toString());
    params.set('col', col.toString());
    try {
        return await fetchApi(`${apiUrl}/fishing?${params.toString()}`, {
            method: 'PUT'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Combat

// GET

export const getMonstersByArea = async (area: string) => {
    const params = new URLSearchParams();
    params.set('area', area);
    try {
        return await fetchApi(`${apiUrl}/combat/monsters?${params.toString()}`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export const getCombat = async () => {
    try {
        return await fetchApi(`${apiUrl}/combat`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// PUT

export const putUpdateCombat = async (action: string, id?: number) => {
    const params = new URLSearchParams();
    params.set('action', action);
    if (id) {
        params.set('id', id.toString());
    }
    try {
        return await fetchApi(`${apiUrl}/combat?${params.toString()}`, {
            method: 'PUT'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export const putResetCombat = async () => {
    try {
        return await fetchApi(`${apiUrl}/combat/reset`, {
            method: 'PUT'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Training

// GET

export const getTrainingAreas = async () => {
    try {
        return await fetchApi(`${apiUrl}/combat/training/areas`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Equipment

// GET

export const getCharacterEquipment = async () => {
    try {
        return await fetchApi(`${apiUrl}/equipment`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export const getEquipmentByCategory = async (category: string) => {
    const params = new URLSearchParams();
    params.set('category', category);
    try {
        return await fetchApi(`${apiUrl}/inventory/equipment?${params.toString()}`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export const postEquipment = async (equipmentId: number) => {
    const params = new URLSearchParams();
    params.set('id', equipmentId.toString());
    try {
        return await fetchApi(`${apiUrl}/equipment?${params.toString()}`, {
            method: 'POST'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export const removeEquipment = async (equipmentId: number) => {
    const params = new URLSearchParams();
    params.set('id', equipmentId.toString());
    try {
        return await fetchApi(`${apiUrl}/equipment?${params.toString()}`, {
            method: 'DELETE'
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Bounty

// GET

export const getBounties = async () => {
    try {
        return await fetchApi(`${apiUrl}/bounty`);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export const updateBounty = async (bountyId: number, updateJson: object) => {
    try {
        return await fetchApi(`${apiUrl}/bounty/${bountyId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateJson)
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
}