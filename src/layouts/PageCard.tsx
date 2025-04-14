import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface PageCardProps {
    title: string;
    icon: IconProp | string;
    loading?: boolean;
    children: React.ReactNode
}

const PageCard = ({ title, icon, loading = false, children }: PageCardProps) => {
    return (
        <div className="card w-full h-full bg-base-100 shadow-md overflow-auto">
            <div className="card-body p-2 md:p-4 lg:p-6 gap-0">
                <div className="prose w-full">
                    <h1 className="text-center sm:text-left">
                        {(typeof icon === "object") && <FontAwesomeIcon icon={icon as IconProp} />}
                        {(typeof icon === "string") && <img src={icon} className="inline not-prose w-10 m-0" />}
                        {' ' + title}
                    </h1>
                </div>
                <div className="divider my-0"></div>
                {loading ? <div className="flex w-full h-full justify-around"><span className="loading loading-spinner loading-xl"></span></div> : children}
            </div>
        </div>
    )
}

export default PageCard;