export type ItemCategory = 'weapon' | 'accessory' | 'consumable' | 'armor' | 'material';

export type item = {
    id: number
    image: {
        base64: string,
        type: string
    },
    name: string,
    category: string,
    value: number,
    description: string,
    amount?: number
}

export type recipe = {
    item: item
    ingredients: item[]
}

export type SupabaseItem = {
    id: number,
    category: { name: string },
    description: string,
    image: { base64: string, type: string },
    name: string,
    value: number
}

export type SupabaseShopItem = {
    item: SupabaseItem;
}

export type SupabaseInventoryItem = {
    amount: number,
    item: SupabaseItem
}

export type SupabaseRecipe = {
    item: SupabaseItem,
    ingredient: SupabaseItem,
    amount: number,
}