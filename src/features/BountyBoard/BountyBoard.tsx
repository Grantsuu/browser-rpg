import { useQuery } from "@tanstack/react-query";
import type { Bounty } from "@src/types";
import PageCard from "@src/layouts/PageCard";
import { getBounties } from "@src/lib/apiClient";
import Collapse from "@components/Collapse/Collapse";
import ResponsiveCardGrid from "@components/Responsive/ResponsiveCardGrid";
import ResponsiveCard from "@components/Responsive/ResponsiveCard";
import ColumnDelayDown from "@components/Animated/Motion/ColumnDelayDown";

const BountyBoard = () => {

    const { data: bounties, isLoading: isBountiesLoading } = useQuery({
        queryKey: ['equipment'],
        queryFn: getBounties
    });

    return (
        <PageCard title="Bounty Board" icon='/images/bounty-board.png'>
            <div>
                <Collapse title="Active Bounties">
                    <></>
                </Collapse>
                <Collapse title="Bounties Available">
                    <ResponsiveCardGrid>
                        {isBountiesLoading ?
                            [...Array(3).keys()].map((index) => {
                                return (
                                    <div className="skeleton h-32 w-full" key={index} />
                                )
                            })
                            : bounties?.map((bounty: Bounty, index: number) => (
                                <ColumnDelayDown key={index} index={index}>
                                    <ResponsiveCard>
                                        {/* <figure>
                                    <img src={bounty.image} alt="Bounty" />
                                </figure> */}
                                        <div className="card-body">
                                            <h2 className="card-title">{bounty.name}</h2>
                                            <p>{bounty.description}</p>
                                            <div className="card-actions justify-end">
                                                <button className="btn btn-primary">Accept</button>
                                            </div>
                                        </div>
                                    </ResponsiveCard>
                                </ColumnDelayDown>
                            ))}
                    </ResponsiveCardGrid>
                </Collapse>
            </div>
        </PageCard>
    );
};

export default BountyBoard;