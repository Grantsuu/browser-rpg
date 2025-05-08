import { clsx } from 'clsx';

interface ResponsiveCardProps {
    children: React.ReactNode
    isDisabled?: boolean
}

const ResponsiveCard = ({ children, isDisabled = false }: ResponsiveCardProps) => {
    return (
        <div className={clsx(
            "card border border-base-300 w-full shadow-md transition-all duration-300 ease-in-out",
            { "bg-base-100 hover:bg-base-200": !isDisabled },
            { "bg-base-300 pointer-events-none": isDisabled },
        )}>
            {children}
        </div>
    );
}
export default ResponsiveCard;