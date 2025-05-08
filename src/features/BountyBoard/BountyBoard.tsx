import { useQuery } from "@tanstack/react-query";
import type { Bounty } from "@src/types";
import PageCard from "@src/layouts/PageCard";
import { getBounties } from "@src/lib/apiClient";
import Collapse from "@components/Collapse/Collapse";
import ResponsiveCardGrid from "@components/Responsive/ResponsiveCardGrid";
import BountyCard from "./BountyCard";
import ColumnDelayDown from "@components/Animated/Motion/ColumnDelayDown";

const BountyBoard = () => {

    const { data: bounties, isLoading: isBountiesLoading } = useQuery({
        queryKey: ['equipment'],
        queryFn: getBounties
    });

    return (
        <PageCard title="Bounty Board" icon='/images/bounty-board.png'>
            <div className="flex flex-col gap-2">
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
                                    <BountyCard bounty={bounty} />
                                </ColumnDelayDown>
                            ))}
                    </ResponsiveCardGrid>
                </Collapse>
            </div>
        </PageCard>
    );
};

export default BountyBoard;