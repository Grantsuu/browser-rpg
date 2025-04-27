import ButtonPress from "@src/components/Animated/Button/ButtonPress";
import type { Equipment } from "@src/types";

interface EquipmentSlotProps {
    title: string;
    isLoading: boolean;
    placeholder: React.ReactNode;
    equipment?: Equipment;
}

const EquipmentSlot = ({ title, equipment, placeholder, isLoading }: EquipmentSlotProps) => {
    return (
        <div className="flex flex-row gap-1 lg:gap-3">
            <div className="flex justify-center aspect-square w-1/3 p-2 rounded-lg border-5 bg-base-200 hover:bg-base-300 hover:cursor-pointer">
                {isLoading ?
                    <span className="loading loading-spinner w-1/2" /> :
                    equipment?.item?.image ?
                        <img src={equipment?.item?.image} alt={title} /> :
                        placeholder
                }
            </div>
            <div className="flex flex-col justify-between w-2/3">
                <div>
                    <div className="text-base font-semibold">{title}</div>
                    <div>
                        {isLoading ?
                            <div className="skeleton h-3 w-full" /> :
                            equipment?.item?.name ?
                                equipment?.item?.name :
                                `None`
                        }
                    </div>
                </div>
                {equipment ?
                    <ButtonPress className="btn-secondary btn-sm btn-outline">
                        Unequip
                    </ButtonPress> :
                    <ButtonPress className="btn-primary btn-sm">
                        Equip
                    </ButtonPress>}
            </div>
        </div>
    );
};

export default EquipmentSlot;