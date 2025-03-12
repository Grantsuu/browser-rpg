import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface PageCardProps {
    title: string;
    icon: IconProp;
    children: React.ReactNode
}

const PageCard = ({ title, icon, children }: PageCardProps) => {
    return (
        <div className="card w-full h-full bg-base-100 shadow-md">
            <div className="card-body min-w-full max-h-full">
                <div className="prose">
                    <h1>
                        <FontAwesomeIcon icon={icon as IconProp} /> {title}
                    </h1>
                </div>
                <div className="divider"></div>
                {children}
            </div>
        </div>
    )
}

export default PageCard;