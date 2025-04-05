import { ItemImage } from "../../types/types";

interface SuccessItemProps {
    name: string;
    amount: number;
    experience: number;
    image: ItemImage;
}

const SuccessItemProps = ({ name, amount, experience, image }: SuccessItemProps) => {
    return (
        <div className='flex flex-row w-full items-center gap-3'>
            <div>
                Successfully crafted {amount}x {name} and gained {experience} experience!
            </div>
            <div className='w-6'>
                <img src={image?.base64} alt={image?.alt ? image.alt : ''} title={image?.alt ? image.alt : ''} />
            </div>
        </div>
    );
}

export default SuccessItemProps;