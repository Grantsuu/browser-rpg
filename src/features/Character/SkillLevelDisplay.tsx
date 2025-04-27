import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { experience_table } from '@constants/game/experience_table';
import ProgressBar from '@src/components/Animated/ProgressBar';

interface SkilllevelDisplayProps {
    title: string;
    icon: string | IconProp;
    level: number;
    experience: number;
    maxExperience: number;
    isLoading?: boolean;
}

const SkillLevelDisplay = ({ title, icon, level, experience, maxExperience, isLoading }: SkilllevelDisplayProps) => {
    const currentLevelExperience = experience_table[level as keyof typeof experience_table];
    return (
        <div className="flex flex-col xl:w-1/2">
            <div className="flex flex-row items-center gap-2">
                {typeof icon === "string" ? <img src={icon} className="w-5" /> : <FontAwesomeIcon icon={icon as IconProp} />}
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="flex flex-row w-full items-center gap-1">
                <span className="font-semibold">Level: </span>
                {isLoading ? <div className="skeleton h-4 w-full"></div> : level}
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-1 mb-1">
                <span className="font-semibold">Experience:</span>
                {isLoading ? <div className="skeleton h-4 w-full"></div> : `${experience} / ${maxExperience}`}
            </div>
            {isLoading ? <div className="skeleton h-4 w-full"></div> : <ProgressBar
                backgroundClassName="h-4"
                width={Math.floor(((experience - currentLevelExperience) / (maxExperience - currentLevelExperience)) * 100)}
            />}
        </div>
    );
}

export default SkillLevelDisplay;