// import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faFish, faFishFins, faWater, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
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
            <div className="flex flex-col md:flex-row justify-between gap-1 md:gap-2">
                {/* Info */}
                <div className="flex flex-col h-full w-full md:w-1/4 lg:w-1/3 text-center items-center justify-between">
                    <div className="flex flex-row items-center gap-2 text-3xl font-bold mb-2">
                        <FontAwesomeIcon icon={faWater as IconProp} />
                        Shallow Waters
                    </div>
                    <div className="flex flex-col text-2xl font-semibold mb-2 items-center">
                        <div>Attempts Left</div>
                        <div className="text-6xl text-blue-500 mb-2">
                            5/5
                        </div>
                        {/* <button className="btn btn-secondary btn-wide">Reset</button> */}
                    </div>

                    <div className="hidden md:inline-block invisible text-3xl">spacer</div>
                </div>
                {/* Fishing Board */}
                <div className="grid grid-cols-3 gap-1 w-full md:w-1/2 lg:w-1/3">
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
                {/* Legend */}
                <div className="w-full md:w-1/4 lg:w-1/3 items-center">
                    <div className="flex flex-row items-center justify-center gap-2 text-3xl font-bold">
                        <FontAwesomeIcon icon={faCircleQuestion as IconProp} />
                        Legend
                    </div>
                    <table className="table md:table-sm lg:table-md xl:table-xl text-center">
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
                                <td>#</td>
                                <td>Adjacent Unempty Tiles</td>
                            </tr>
                            <tr>
                                <td><FontAwesomeIcon icon={faFishFins as IconProp} /></td>
                                <td>Fish</td>
                            </tr>
                            <tr>
                                <td className="text-yellow-400"><FontAwesomeIcon icon={faFishFins as IconProp} /></td>
                                <td>Bountiful Fish</td>
                            </tr>
                            <tr>
                                <td className="text-yellow-400"><FontAwesomeIcon icon={faExclamation as IconProp} /></td>
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