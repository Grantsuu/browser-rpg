import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface FishingTileProps {
    label: string | IconProp;
    color?: string;
}

const FishingTile = ({ label, color }: FishingTileProps) => {
    const [isDiscovered, setIsDiscovered] = useState(false);

    return (
        <div onClick={() => { setIsDiscovered(true) }} className="card w-full aspect-square bg-blue-500 shadow-sm hover:bg-blue-400">
            <div className={`card-body justify-center items-center text-4xl font-semibold cursor-pointer ${isDiscovered && color ? color : "text-white"}`}>
                {/* If tile is not yet discovered display a '?' */}
                {!isDiscovered ? (
                    <FontAwesomeIcon icon={faQuestion as IconProp} />
                ) :
                    typeof (label) === "string" ? (
                        label
                    ) : (
                        <FontAwesomeIcon icon={label as IconProp} />
                    )
                }
            </div>
        </div>
    )
}

export default FishingTile;