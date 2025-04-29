import type { Equipment } from '@src/types'; // Adjust the path as needed

interface EquipmentStatDisplayProps {
    equipment: Equipment;
}

const EquipmentStatDisplay = ({ equipment }: EquipmentStatDisplayProps) => {

    return (
        <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-1 font-semibold items-center text-sm">
                <img src='/images/heart.png' className="w-5" /> {equipment?.health}
            </div>
            <div className="flex flex-row gap-1 font-semibold items-center text-sm">
                <img src='/images/muscle.png' className="w-5" />  {equipment?.power}
            </div>
            <div className="flex flex-row gap-1 font-semibold items-center text-sm">
                <img src='/images/shield.png' className="w-5" /> {equipment?.toughness}
            </div>
        </div>
    );
};
export default EquipmentStatDisplay;