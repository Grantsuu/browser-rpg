export type ItemCategory = 'weapon' | 'accessory' | 'consumable' | 'armor' | 'material';

export type RecipeCategory = 'cooking';

export type ItemImage = {
    base64: string
    alt: string
}

export type item = {
    id: number
    image: ItemImage,
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
    required_level: number
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
    previous_crop: Crop
}

export type FishingData = {
    id: number,
    character_id: string,
    turns: number | null,
    game_state: object | null
    area: FishingArea | null,
    previous_area: FishingArea | null
}

export type FishingArea = {
    name: string,
    description: string,
    max_turns: number,
    size: FishingAreaSize,
    required_level: number,
}

export type FishingAreaSize = {
    name: string,
    rows: number,
    cols: number
}