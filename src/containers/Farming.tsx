import { useState, useEffect } from 'react';
import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import PageCard from '../layouts/PageCard';
import FarmPlot from '../components/Farming/FarmPlot';

// const MAX_PLOTS = 3;

const Farming = () => {
    const [loading, setLoading] = useState(false);

    const [plots, setPlots] = useState([0, 0, 0]);

    useEffect(() => {
        console.log(loading);
        setLoading(false);
    }, []);

    return (
        <PageCard title="Farming" icon={faSeedling}>
            <div className="grid grid-cols-3 gap-4">
                {
                    plots.map((index) => {
                        return (
                            <FarmPlot key={index} />
                        )
                    })
                }
            </div>
        </PageCard>
    )
}

export default Farming;