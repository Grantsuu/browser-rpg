import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface PageCardProps {
    title: string;
    icon: IconProp | string;
    titleContent?: React.ReactNode;
    children: React.ReactNode
}

const PageCard = ({ title, icon, titleContent, children }: PageCardProps) => {
    return (
        <div className="card rounded-md w-full h-full bg-base-100 shadow-md overflow-y-auto border-1 border-base-200">
            <div className="card-body p-2 md:p-3 lg:p-4 gap-0">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-row gap-2 text-2xl font-bold text-center sm:text-left">
                        {(typeof icon === "object") && <FontAwesomeIcon icon={icon as IconProp} />}
                        {(typeof icon === "string") && <img src={icon} className="inline not-prose w-8 m-0" />}
                        {' ' + title}
                    </div>
                    {titleContent}
                </div>
                <div className="divider my-0"></div>
                {children}
            </div>
        </div>
    )
}

export default PageCard;