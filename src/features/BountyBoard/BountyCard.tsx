import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Bounty } from "@src/types";
import ResponsiveCard from "@components/Responsive/ResponsiveCard";
import BountyRewardIcon from "./BountyRewardIcon";
import ButtonPress from "@src/components/Animated/Button/ButtonPress";
import ProgressBar from '@src/components/Animated/ProgressBar';

interface BountyCardProps {
    bounty: Bounty;
};

const BountyCard = ({ bounty }: BountyCardProps) => {
    let color;
    if (bounty?.category === 'gathering') {
        color = 'success';
    } else if (bounty?.category === 'crafting') {
        color = 'info';
    } else {
        color = 'error';
    }

    return (
        <ResponsiveCard>
            <div className="card-body">
                {/* Name */}
                <div className="flex flex-row gap-2 items-center justify-center">
                    {bounty?.category === 'gathering' && <div className="tooltip" data-tip="Gathering"><img src="/images/gathering.png" alt="Gathering" className="w-5 h-5" /></div>}
                    {bounty?.category === 'crafting' && <div className="tooltip" data-tip="Crafting"><img src="/images/crafting.png" alt="Crafting" className="w-5 h-5" /></div>}
                    {bounty?.category === 'combat' && <div className="tooltip" data-tip="Combat"><img src="/images/swords.png" alt="Combat" className="w-5 h-5" /></div>}
                    <h2 className="card-title justify-center">{bounty.name}</h2>
                </div>
                {/* Indicator */}
                <div className="flex justify-center">
                    <div className="indicator w-20">
                        <span className="indicator-item indicator-bottom indicator-center badge border-base-content">
                            {bounty?.required_progress}/{bounty?.required_quantity}
                        </span>
                        <div className="p-2 border-4 rounded-lg" style={{ borderColor: `var(--color-${color})` }}>
                            {bounty?.required_item &&
                                <img src={bounty?.required_item?.image} alt="Bounty" />}
                            {bounty?.required_monster &&
                                <img src={bounty?.required_monster?.image} alt="Bounty" />}
                        </div>
                    </div>
                </div>
                {/* Progress Bar */}
                <ProgressBar
                    backgroundClassName='h-4 mt-3'
                    foregroundClassName={`${bounty.category === 'gathering' ? 'bg-success' : bounty.category === 'crafting' ? 'bg-info' : 'bg-error'}`}
                    width={Math.floor((bounty?.required_progress / bounty?.required_quantity) * 100)}
                />
                {/* Rewards */}
                <div className="text-center">Rewards</div>
                <div className="flex flex-row flex-wrap gap-1 items-center justify-center">
                    {/* Item */}
                    {bounty?.reward_item &&
                        <BountyRewardIcon
                            tooltip={
                                <div>
                                    <p className="text-base font-bold">{bounty?.reward_item?.name}</p>
                                    Amount: <i>{bounty?.reward_item_quantity}</i>
                                </div>
                            }
                            indicatorText={bounty?.reward_item_quantity?.toString()}
                            image={<img src={bounty?.reward_item?.image} alt={bounty?.reward_item?.name} />}
                        />}
                    {/* Gold */}
                    {bounty?.gold &&
                        <BountyRewardIcon
                            tooltip={
                                <div>
                                    <p className="text-base font-bold">Gold</p>
                                    Amount: <i>{bounty?.gold}</i>
                                </div>
                            }
                            indicatorText={bounty?.gold?.toString()}
                            image={<img src="/images/coins.png" alt="Coins" />}
                        />}
                    {/* Experience */}
                    {bounty?.experience &&
                        <BountyRewardIcon
                            tooltip={
                                <div>
                                    <p className="text-base font-bold">Experience</p>
                                    Amount: <i>{bounty?.experience}</i>
                                </div>
                            }
                            indicatorText={bounty?.experience?.toString()}
                            image={<img src="/images/xp.png" alt="Experience" />}
                        />}
                    {/* Tokens */}
                    {bounty?.bounty_tokens &&
                        <BountyRewardIcon
                            tooltip={
                                <div>
                                    <p className="text-base font-bold">Bounty Tokens</p>
                                    Amount: <i>{bounty?.bounty_tokens}</i>
                                </div>
                            }
                            indicatorText={bounty?.bounty_tokens?.toString()}
                            image={<img src="/images/bounty_token.png" alt="Bounty Tokens" />}
                        />}
                </div>
            </div>
            {/* Buttons */}
            <div className="card-actions justify-between pl-5 pb-5 pr-5">
                {/* Reroll */}
                <ButtonPress className="btn-secondary btn-outline">
                    Reroll <FontAwesomeIcon icon={faDice as IconProp} />
                </ButtonPress>
                {/* Accept */}
                <ButtonPress
                    className={
                        bounty?.category === 'gathering' ? 'btn-success' :
                            bounty?.category === 'crafting' ? 'btn-info' :
                                bounty?.category === 'combat' ? 'btn-error' : 'btn-primary'
                    }
                >
                    Accept
                </ButtonPress>
            </div>
        </ResponsiveCard>
    )
}


export default BountyCard;