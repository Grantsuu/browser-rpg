import { Bounty } from "@src/types";

interface BountyCardProps {
    bounty: Bounty;
};

const BountyCard = ({ bounty }: BountyCardProps) => {
    return (
        <div>
            Bounty Card
            {JSON.stringify(bounty)}
        </div>
    )
}


export default BountyCard;