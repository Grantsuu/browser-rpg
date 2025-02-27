import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useSupabase } from "../contexts/SupabaseContext"

interface item {
    image: string,
    name: string,
    category: string,
    amount: number,
    value: number,
    description: string
}

const Inventory = () => {
    const { supabaseClient, supabaseUser } = useSupabase();

    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState<item[]>([]);

    const getCharacterId = async () => {
        if (supabaseClient && supabaseUser) {
            const { data, error } = await supabaseClient
                .from('characters')
                .select('id')
                .eq('user', supabaseUser.id)
            if (error) {
                return ''
            }
            return data[0].id
        }
    }

    const handleGetInventory = async () => {
        setLoading(true);
        if (supabaseClient && supabaseUser) {
            const characterId = await getCharacterId();
            const { data, error } = await supabaseClient
                .from('inventories')
                .select(`
                    amount,
                    item:items(
                        name,
                        category:item_categories(name),
                        value,
                        description,
                        image:item_images(base64)
                    )
                `)
                .eq('character', characterId);
            if (!error) {
                console.log(data);
                data.map((item) => {
                    setInventory([...inventory, {
                        image: item.item.image.base64,
                        name: item.item.name,
                        category: item.item.category.name,
                        amount: item.amount,
                        value: item.item.value,
                        description: item.item.description
                    }])
                })
            }
        }
        setLoading(false);
    }

    // const items: item[] = [
    //     {
    //         image: "items/blazing_edge.svg",
    //         name: "Blazing Edge",
    //         category: "Weapon",
    //         amount: 1,
    //         value: 2500,
    //         description: "A sword imbued with the essence of fire, burning enemies with each strike."
    //     },
    //     {
    //         image: "items/ring_of_arcane.svg",
    //         name: "Ring of Arcane Insight",
    //         category: "Accessory",
    //         amount: 1,
    //         value: 1800,
    //         description: "An enchanted ring that enhances the wearer’s magical abilities and intellect."
    //     },
    //     {
    //         image: "items/potion_of_rejuvination.svg",
    //         name: "Potion of Rejuvenation",
    //         category: "Consumable",
    //         amount: 3,
    //         value: 300,
    //         description: "A rare potion that instantly heals wounds and restores stamina."
    //     },
    //     {
    //         image: "items/cloak_phantom.svg",
    //         name: "Cloak of the Phantom",
    //         category: "Armor",
    //         amount: 1,
    //         value: 2200,
    //         description: "A dark, ethereal cloak that grants invisibility for a short period when activated."
    //     },
    //     {
    //         image: "items/dragon_scale.svg",
    //         name: "Dragon Scale",
    //         category: "Ingredient",
    //         amount: 3,
    //         value: 2000,
    //         description: "A shimmering scale from an ancient dragon, used in crafting indestructible armor and potions of fortitude."
    //     }
    // ];

    useEffect(() => {
        handleGetInventory();
        // eslint-disable-next-line
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
                                    {inventory.map((item: item, id) => {
                                        return (
                                            <tr className="table-row items-baseline justify-baseline hover:bg-base-300 m-0" key={id}>
                                                <td className="m-0 w-1/16">
                                                    <img src={`data:image/svg+xml;base64,${item.image}`} />
                                                </td>
                                                <td>
                                                    {item.name}
                                                </td>
                                                <td>
                                                    <span className="badge badge-soft badge-primary badge-sm">
                                                        {item.category}
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