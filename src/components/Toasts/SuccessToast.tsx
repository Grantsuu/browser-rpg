import React from "react";
import { ItemImage } from "../../types/types";

interface SuccessToastProps {
    action: string;
    name: string;
    amount: number;
    experience?: number;
    extendedMessage?: React.ReactNode;
    image?: ItemImage;
}

const SuccessToast = ({ action, name, amount, experience, image, extendedMessage }: SuccessToastProps) => {
    return (
        <div className='flex flex-row w-full justify-between items-center gap-1'>
            <div>
                {action} <b>{amount}x</b> <span className="text-blue-500">{name}</span>{experience ? <> and gained <span className="text-green-600"><b>{experience}</b></span> experience!</> : extendedMessage ? extendedMessage : '.'}
            </div>
            {image ? <div className='w-1/4'>
                <img src={image?.base64} alt={image?.alt ? image.alt : ''} title={image?.alt ? image.alt : ''} />
            </div> : <></>}
        </div>
    );
}

export default SuccessToast;