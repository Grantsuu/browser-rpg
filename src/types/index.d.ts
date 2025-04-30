export type ItemCategory = 'weapon' | 'accessory' | 'consumable' | 'armor' | 'material' | 'equipment';

export type ItemSubcategory = 'food' | 'seed' | 'ingredient' | 'fish';

export type ItemEffectType = 'restore_health';

export type ItemEffectUnit = 'integer' | 'second';

export type ItemEffectData = {
    id: number,
    item_id: number,
    effect: ItemEffectType,
    effect_value: number,
    effect_unit: ItemEffectUnit
}

export type EquipmentCategoryType = 'weapon' | 'armor' | 'accessory';

export type EquipmentSubcategoryType = 'sword' | 'axe' | 'pickaxe' | 'shovel' | 'fishing_rod' | 'ring' | 'amulet';

export type Item = {
    id: number,
    amount?: number
    name: string,
    item_category: ItemCategory,
    item_subcategory?: ItemSubcategory,
    value: number,
    description: string,
    image: string,
    item_effects?: ItemEffectData[],
    equipment_id?: number,
    health?: number,
    power?: number,
    toughness?: number,
    equipment_category?: EquipmentCategoryType,
    equipment_subcategory?: EquipmentSubcategoryType,
    required_level?: number,
    equipment_effects?: EquipmentEffectData[],
}

export type RecipeCategory = 'cooking';

export type Recipe = {
    item: Item
    ingredients: Item[]
    amount: number
    category: string
    experience: number
    required_level: number
}

export type Crop = {
    id: number,
    seed: Item,
    grow_time: number,
    experience: number,
    product: Item,
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

export type Monster = {
    id: number;
    name: string;
    description: string;
    area: string;
    level: number;
    health: number;
    power: number;
    toughness: number;
    experience: number;
    gold: number;
    image: string;
}

export type CombatDataMonster = Monster & {
    max_health: number;
}

export type CombatOutcomes = "player_wins" | "player_loses" | "player_flees";

export type CombatOutcome = {
    status: CombatOutcomes;
    rewards?: {
        gold: number;
        experience: number;
        level?: number;
        loot: { item: Item, quantity: number }[];
    }
}

export type CombatState = {
    outcome?: CombatOutcome,
    last_actions?: {
        player: {
            action: string;
            amount: number;
        };
        monster: {
            action: string;
            amount: number;
        };
    };
}

export type CombatDataPlayer = {
    health: number;
    max_health: number;
    power: number;
    toughness: number;
}

export type CombatData = {
    id: number;
    character_id: string;
    state: CombatState;
    monster: CombatDataMonster;
    player: CombatDataPlayer;
}