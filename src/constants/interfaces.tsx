export interface item {
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

export interface recipe {
    item: item
    ingredients: item[]
}

export interface SupabaseItem {
    id: number,
    category: { name: string },
    description: string,
    image: { base64: string, type: string },
    name: string,
    value: number
}

export interface SupabaseShopItem {
    item: SupabaseItem;
}

export interface SupabaseInventoryItem {
    amount: number,
    item: SupabaseItem
}

export interface SupabaseRecipe {
    item: SupabaseItem,
    ingredient: SupabaseItem,
    amount: number,
}