import type { Item } from "../../types";

interface ItemUseToastProps {
    item: Item;
    amount: number;
    results: string[];
}

const ItemUseToast = ({ item, amount, results }: ItemUseToastProps) => {

    return (
        <div className='flex flex-row w-full justify-between items-center gap-1'>
            <div>
                Used <b>{amount}x</b> <span className="text-blue-500">{item.name}</span> {
                    item.effects && item.effects.length > 0 ? <>
                        {results.map((result: string, index: number) => {
                            return (
                                <span key={index}>
                                    {results.length - 1 === index && ' and '}{result}{index < results.length - 1 ? ', ' : ''}
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