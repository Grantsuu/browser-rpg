import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { SupabaseContext } from "../contexts/SupabaseContext"

interface item {
    image: string,
    name: string,
    type: string,
    amount: number,
    value: number,
    description: string
}

const Inventory = () => {
    const supabase = useContext(SupabaseContext);

    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState<item[]>([]);

    const items: item[] = [
        {
            image: "items/blazing_edge.svg",
            name: "Blazing Edge",
            type: "Weapon",
            amount: 1,
            value: 2500,
            description: "A sword imbued with the essence of fire, burning enemies with each strike."
        },
        {
            image: "items/ring_of_arcane.svg",
            name: "Ring of Arcane Insight",
            type: "Accessory",
            amount: 1,
            value: 1800,
            description: "An enchanted ring that enhances the wearer’s magical abilities and intellect."
        },
        {
            image: "items/potion_of_rejuvination.svg",
            name: "Potion of Rejuvenation",
            type: "Consumable",
            amount: 3,
            value: 300,
            description: "A rare potion that instantly heals wounds and restores stamina."
        },
        {
            image: "items/cloak_phantom.svg",
            name: "Cloak of the Phantom",
            type: "Armor",
            amount: 1,
            value: 2200,
            description: "A dark, ethereal cloak that grants invisibility for a short period when activated."
        },
        {
            image: "items/dragon_scale.svg",
            name: "Dragon Scale",
            type: "Ingredient",
            amount: 3,
            value: 2000,
            description: "A shimmering scale from an ancient dragon, used in crafting indestructible armor and potions of fortitude."
        }
    ];

    useEffect(() => {
        // setLoading(true);
        setInventory(items);
        setLoading(false);
    }, []);

    return (
        <>
            {loading ? <span className="loading loading-spinner loading-xl"></span> :
                <div className="card w-full h-full bg-base-100 shadow-md">
                    <div className="card-body min-w-full max-h-full">
                        <div className="prose">
                            <h1>
                                <FontAwesomeIcon icon={faBox as IconProp} /> Inventory
                            </h1>
                        </div>
                        <div className="divider"></div>
                        <div className="overflow-y-scroll w-full h-full rounded border border-base-content/8 ">
                            <table className="table table-pin-rows bg-base-100">
                                {/* head */}
                                <thead>
                                    <tr className="bg-secondary-content">
                                        <th></th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Value</th>
                                        <th>Description</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map((item: item) => {
                                        return (
                                            <tr className="table-row items-baseline justify-baseline hover:bg-base-300 m-0">
                                                <td className="m-0">
                                                    <img src={item.image} className="w-10" />
                                                </td>
                                                <td>
                                                    {item.name}
                                                </td>
                                                <td>
                                                    <span className="badge badge-soft badge-primary badge-sm">
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td>
                                                    {item.amount}
                                                </td>
                                                <td>
                                                    {item.value}
                                                </td>
                                                <td>
                                                    {item.description}
                                                </td>
                                                <td>
                                                    <button className="btn btn-soft btn-error">Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default Inventory;