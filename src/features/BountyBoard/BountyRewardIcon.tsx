import React from "react";

interface BountyRewardIconProps {
    tooltip: React.ReactNode;
    indicatorText: string;
    image: React.ReactNode;
}

const BountyRewardIcon = ({ tooltip, indicatorText, image }: BountyRewardIconProps) => {
    return (
        <div className="tooltip">
            <div className="tooltip-content">
                {tooltip}
            </div>
            <div className="indicator">
                <span className="indicator-item indicator-bottom indicator-center badge badge-sm border-base-content">
                    {indicatorText}
                </span>
                <div className="w-15 bg-base-100 border-3 border-base rounded-lg p-1">
                    {image}
                </div>
            </div>
        </div>
    );
};

export default BountyRewardIcon;