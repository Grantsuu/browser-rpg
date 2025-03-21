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

export type Recipe = {
    item: item
    ingredients: item[]
    amount: number
    category: string
    experience: number
}

export type Crop = {
    id: number,
    seed: item,
    grow_time: number,
    experience: number,
    product: item,
    required_level: number,
    amount_produced: number[]
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
    crop: Crop,
    start_time: string,
    end_time: string
}