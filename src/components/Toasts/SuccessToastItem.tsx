import { ItemImage } from "../../types/types";

interface SuccessToastItemProps {
    action: string;
    name: string;
    amount: number;
    experience: number;
    image: ItemImage;
}

const SuccessToastItem = ({ action, name, amount, experience, image }: SuccessToastItemProps) => {
    // console.log('image', image);
    return (
        <div className='flex flex-row w-full items-center gap-1'>
            <div>
                {action} <b>{amount}x</b> <span className="text-blue-500">{name}</span> and gained <span className="text-green-600">{experience}</span> experience!
            </div>
            <div className='w-1/4'>
                <img src={image?.base64} alt={image?.alt ? image.alt : ''} title={image?.alt ? image.alt : ''} />
            </div>
        </div>
    );
}

export default SuccessToastItem;