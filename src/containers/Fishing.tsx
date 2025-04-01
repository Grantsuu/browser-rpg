// import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faFish, faFishFins, faHashtag, faWater, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import PageCard from '../layouts/PageCard';
import FishingTile from "../components/Fishing/FishingTile";

const Farming = () => {
    // const fishingAttempts = useMemo(() => {
    //     const attempts = 5;
    //     const maxAttempts = 5;
    //     return attempts >= maxAttempts ? maxAttempts : attempts;
    // }, []);

    return (
        <PageCard title="Fishing" icon={faFish}>
            {/* Info */}
            <div className="flex flex-col w-full text-center items-center justify-between">
                <div className="flex flex-row items-center gap-2 text-2xl font-bold">
                    <FontAwesomeIcon icon={faWater as IconProp} />
                    Shallow Waters
                </div>
                <div className="flex flex-col text-xl font-semibold mb-2 items-center">
                    <div>Attempts Left</div>
                    <div className="text-2xl md: text-6xl text-blue-500">
                        5/5
                    </div>
                    {/* <button className="btn btn-secondary btn-wide">Reset</button> */}
                </div>
            </div>
            <div className="flex flex-col justify-around sm:flex-row gap-1 md:gap-2">
                {/* Fishing Board */}
                <div className="w-full w-full sm:w-1/2 lg:w-1/2 xl:w-1/3">
                    <div className="grid grid-cols-3 gap-1">
                        <FishingTile label={faFishFins} />
                        <FishingTile label="3" />
                        <FishingTile label={faFishFins} />
                        <FishingTile label="2" />
                        <FishingTile label={faFishFins} color="text-yellow-400" />
                        <FishingTile label="3" />
                        <FishingTile label="1" />
                        <FishingTile label="2" />
                        <FishingTile label={faExclamation} color="text-yellow-400" />
                    </div>
                </div>
                {/* Legend */}
                <div className="w-full sm:w-1/2 items-center">
                    <div className="flex flex-row items-center justify-center gap-2 text-2xl font-bold">
                        <FontAwesomeIcon icon={faQuestion as IconProp} className="text-lg aspect-square border-2 rounded-full p-1" />
                        Legend
                    </div>
                    <table className="table md:table-sm lg:table-md xl:table-lg text-center">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Meaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><FontAwesomeIcon icon={faQuestion as IconProp} /></td>
                                <td>Undiscovered</td>
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon icon={faHashtag as IconProp} className="aspect-square border-2 p-1" /></td>
                                <td>Adjacent Unempty Tiles</td>
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon icon={faFishFins as IconProp} className="border-2 rounded-full p-1" /></td>
                                <td>Fish</td>
                            </tr>
                            <tr>
                                <td className="text-yellow-400"><FontAwesomeIcon icon={faFishFins as IconProp} className="border-2 rounded-full p-1" /></td>
                                <td>Bountiful Fish</td>
                            </tr>
                            <tr>
                                <td className="text-yellow-400"><FontAwesomeIcon icon={faExclamation as IconProp} className="aspect-square border-2 rounded-full p-1" /></td>
                                <td>Random Event</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </PageCard >
    )
}

export default Farming;