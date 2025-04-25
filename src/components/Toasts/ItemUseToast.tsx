import type { Item, ItemEffectData } from "../../types";

interface ItemUseToastProps {
    item: Item;
    amount: number;
}

const ItemUseToast = ({ item, amount, }: ItemUseToastProps) => {

    const parseEffect = (effect: ItemEffectData) => {
        switch (effect.effect) {
            case 'restore_health':
                return <span><i>restored</i> <span className="text-green-500">{effect.effect_value}</span> health</span>;
            default:
                return `Unknown effect: ${effect.effect}`;
        }
    }

    return (
        <div className='flex flex-row w-full justify-between items-center gap-1'>
            <div>
                Used <b>{amount}x</b> <span className="text-blue-500">{item.name}</span> {
                    item.effects && item.effects.length > 0 ? <>
                        {item.effects.map((effect: ItemEffectData, index: number) => {
                            return (
                                item.effects && <span key={index}>
                                    {item.effects.length - 1 === index && ' and '}{parseEffect(effect)}{index < item.effects.length - 1 ? ', ' : ''}
                                </span>
                            )
                        })}</> : <></>
                }.
            </div>
            <div className='w-1/5'>
                <img src={item?.base64} alt={item?.name} title={item?.name} />
            </div>
        </div>
    );
}

export default ItemUseToast;