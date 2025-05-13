import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { Bounty } from "@src/types";
import PageCard from "@src/layouts/PageCard";
import { getBounties } from "@src/lib/apiClient";
import ResponsiveCardGrid from "@components/Responsive/ResponsiveCardGrid";
import BountyCard from "./BountyCard";
import ColumnDelayDown from "@components/Animated/Motion/ColumnDelayDown";
import ButtonPress from "@src/components/Animated/Button/ButtonPress";

const BountyBoard = () => {

    const { data: bounties, isLoading: isBountiesLoading } = useQuery({
        queryKey: ['equipment'],
        queryFn: getBounties
    });

    return (
        <PageCard
            title="Bounty Board"
            icon='/images/bounty-board.png'
            titleContent={
                <div className="border-1 border-base rounded-md bg-base-300 p-2">
                    <div className="flex flex-row gap-2 items-center">
                        <img src="/images/bounty_token.png" alt="Bounty Board" className="w-5 h-5" />
                        <span className="text-sm font-bold">Bounty Tokens: 1</span>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <ButtonPress className="btn-primary">
                        Roll Bounty <FontAwesomeIcon icon={faDice as IconProp} />
                    </ButtonPress>
                    <div className="border-1 border-base rounded-md p-2">
                        Gathering: 0/1 | Crafting: 0/1 | Combat: 0/1
                    </div>
                </div>
                <ResponsiveCardGrid>
                    {isBountiesLoading ?
                        [...Array(3).keys()].map((index) => {
                            return (
                                <div className="skeleton h-32 w-full" key={index} />
                            )
                        })
                        : bounties?.sort((a: Bounty, b: Bounty) => a.category.localeCompare(b.category)).map((bounty: Bounty, index: number) => (
                            <ColumnDelayDown key={index} index={index}>
                                <BountyCard bounty={bounty} />
                            </ColumnDelayDown>
                        ))}
                </ResponsiveCardGrid>
            </div>
        </PageCard>
    );
};

export default BountyBoard;