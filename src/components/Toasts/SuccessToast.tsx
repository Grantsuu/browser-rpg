import React from "react";

interface SuccessToastProps {
    action: string;
    name: string;
    amount?: number;
    experience?: number;
    extendedMessage?: React.ReactNode;
    image?: string;
}

const SuccessToast = ({ action, name, amount, experience, image, extendedMessage }: SuccessToastProps) => {
    return (
        <div className='flex flex-row w-full justify-between items-center gap-1'>
            <div>
                {action} {amount ? <b>{amount}x</b> : ''} <span className="text-blue-500">{name}</span>{experience ? <> and gained <span className="text-green-600"><b>{experience}</b></span> experience!</> : extendedMessage ? extendedMessage : '.'}
            </div>
            {image ? <div className='w-1/5'>
                <img src={image} alt={name} title={name} />
            </div> : <></>}
        </div>
    );
}

export default SuccessToast;