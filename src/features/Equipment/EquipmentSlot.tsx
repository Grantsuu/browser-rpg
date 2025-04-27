import ButtonPress from "@src/components/Animated/Button/ButtonPress";
import type { Equipment, EquipmentCategoryType } from "@src/types";
import { toTitleCase } from "@src/utils/strings";

interface EquipmentSlotProps {
    category: EquipmentCategoryType;
    isLoading: boolean;
    placeholder: React.ReactNode;
    equipment?: Equipment;
}

const EquipmentSlot = ({ category, equipment, placeholder, isLoading }: EquipmentSlotProps) => {

    return (
        <>
            <div className="flex flex-row gap-1 lg:gap-3">
                <div className="flex justify-center aspect-square w-1/3 p-2 rounded-lg border-5 bg-base-300 hover:bg-base-100 hover:cursor-pointer">
                    {isLoading ?
                        <span className="loading loading-spinner w-1/2" /> :
                        equipment?.item?.image ?
                            <img src={equipment?.item?.image} alt={category} /> :
                            placeholder
                    }
                </div>
                <div className="flex flex-col justify-between w-2/3">
                    <div>
                        <div className="text-base font-semibold">{toTitleCase(category as string)}</div>
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
                        <ButtonPress className="btn-secondary btn-sm btn-outline" disabled={isLoading}>
                            Unequip
                        </ButtonPress> :
                        <ButtonPress className="btn-primary btn-sm" disabled={isLoading}>
                            Equip
                        </ButtonPress>}
                </div>
            </div>
        </>
    );
};

export default EquipmentSlot;