import { clsx } from 'clsx';

interface ResponsiveCardProps {
    children: React.ReactNode
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
    onClick?: () => void
    isDisabled?: boolean
    isClickable?: boolean
}

const ResponsiveCard = ({ children, className, onClick, isDisabled = false, isClickable }: ResponsiveCardProps) => {
    return (
        <div
            className={clsx(
                "card border border-base-300 w-full shadow-md transition-opacity duration-300 ease-in-out",
                className,
                { "bg-base-100 hover:bg-base-200": !isDisabled },
                { "bg-base-300 pointer-events-none": isDisabled },
                { "cursor-pointer": isClickable }
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
export default ResponsiveCard;