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
        <div onClick={() => { setIsDiscovered(true) }} className="card w-full aspect-square bg-blue-500 shadow-sm hover:bg-blue-400 border-r-4 border-b-4 border-blue-700 hover:border-blue-500 transition-all duration-300 ease-in-out">
            <div className={`card-body justify-center items-center text-2xl xs:text-3xl xl:text-4xl font-semibold cursor-pointer ${isDiscovered && color ? color : "text-white"}`}>
                {/* If tile is not yet discovered display a '?' */}
                {!isDiscovered ? (
                    <FontAwesomeIcon icon={faQuestion as IconProp} />
                ) :
                    typeof (label) === "string" ? (
                        <div className="aspect-square border-4 text-center">
                            {label}
                        </div>
                    ) : (
                        <div className="aspect-square border-4 rounded-full p-1 text-center">
                            <FontAwesomeIcon icon={label as IconProp} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default FishingTile;