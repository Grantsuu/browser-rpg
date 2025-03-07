const apiUrl = import.meta.env.VITE_API_URL;

// Shop

// GET
export const getShopInventory = async () => {
    const response = await fetch(`${apiUrl}/shop`);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}