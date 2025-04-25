import type { ItemEffectData } from "@src/types";

interface ItemEffectDisplayProps {
    effects: ItemEffectData[];
}

const ItemEffectDisplay = ({ effects }: ItemEffectDisplayProps) => {

    const parseEffect = (effect: ItemEffectData) => {
        switch (effect.effect) {
            case 'restore_health':
                return <span><i>Restores</i> <span className="text-green-500">{effect.effect_value}</span> health.</span>;
            default:
                return `Unknown effect: ${effect.effect}`;
        }
    }

    return (
        <div className="flex flex-col">
            {effects.map((effect: ItemEffectData) => (
                <div key={effect.id} className="">
                    {parseEffect(effect)}
                </div>
            ))}
        </div>
    )
}

export default ItemEffectDisplay