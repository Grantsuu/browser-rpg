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