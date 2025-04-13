import { clsx } from 'clsx';

interface ResponsiveCardProps {
    children: React.ReactNode
    isDisabled?: boolean
}

const ResponsiveCard = ({ children, isDisabled = false }: ResponsiveCardProps) => {
    return (
        <div className={clsx(
            "card w-full  shadow-md transition-all duration-300 ease-in-out",
            { "bg-base-100 hover:bg-gray-100": !isDisabled },
            { "bg-gray-300 pointer-events-none": isDisabled },
        )}>
            {children}
        </div>
    );
}
export default ResponsiveCard;