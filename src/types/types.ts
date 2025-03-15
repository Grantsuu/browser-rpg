export type ItemCategory = 'weapon' | 'accessory' | 'consumable' | 'armor' | 'material';

export type item = {
    id: number
    image: {
        base64: string
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

export type Character = {
    id: string,
    created_at: string,
    name: string,
    gold: number,
    farming_experience: number
}

export type FarmPlotData = {
    id: number,
    character_id: string,
    crop_id: number,
    start_time: string,
    end_time: string
}