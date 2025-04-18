import { clsx } from "clsx";

interface ProgressBarProps {
    backgroundClassName?: React.HTMLAttributes<HTMLDivElement>['className'];
    foregroundClassName?: React.HTMLAttributes<HTMLDivElement>['className'];
    width: number;
}

const ProgressBar = ({ backgroundClassName, foregroundClassName, width }: ProgressBarProps) => {
    return (
        <div className={clsx('bg-gray-200 rounded-full', backgroundClassName ? backgroundClassName : 'h-4 w-[100%]')}>
            <div
                className={clsx("rounded-full h-full transition-[width] ease-in-out duration-250", foregroundClassName ? foregroundClassName : "bg-primary")}
                style={{ width: `${width}%` }}
            />
        </div>
    );
}
export default ProgressBar;