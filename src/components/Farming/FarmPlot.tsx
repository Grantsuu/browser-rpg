import { useEffect, useState } from 'react';
import { parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import { FarmPlotData } from "../../types/types";


interface FarmPlotProps {
    plotData: FarmPlotData;
}

const FarmPlot = ({ plotData }: FarmPlotProps) => {
    const [status, setStatus] = useState('Inactive');

    useEffect(() => {
        const time = new Date().toLocaleString();
        const plotEndTime = plotData.end_time ? parseISO(plotData.end_time).toLocaleString() : '';
        setStatus((Object.values(plotData).length === 0) ? 'Inactive' : (plotEndTime > time) ? 'Growing' : 'Ready to Harvest');
    }, [plotData]);

    return (
        <div className="card w-full bg-base-100 card-lg shadow-sm">
            <div className="card-body">
                <div className="flex w-full items-center justify-center">
                    <h2 className="card-title text-center">Farm Plot</h2>
                </div>
                <div className="flex justify-center">
                    {status === 'Inactive' ? <FontAwesomeIcon icon={faSeedling as IconProp} size="3x" color="green" /> : <img src={plotData.crop && (status === 'Growing' ? plotData.crop.seed.image.base64 : plotData.crop.product.image.base64)} alt="crop" className="w-15" />}
                </div>
                <div className="prose">
                    <div><b>Status:</b> {status}</div>
                    <div><b>Contents:</b> {plotData.crop ? plotData.crop.seed.name : 'None'}</div>
                    <div className="flex flew-row items-baseline gap-2">
                        <div><b>Progress:</b></div>
                        <progress className="progress progress-success w-full" value="100" max="100"></progress>
                        30s
                    </div>
                </div>
                <div className="justify-center card-actions">
                    {status === 'Inactive' && <button className="btn btn-primary btn-wide">Plant Seeds</button>}
                    {status === 'Growing' && <button className="btn btn-secondary btn-wide">Cancel</button>}
                    {status === 'Ready to Harvest' && <button className="btn btn-success btn-wide">Harvest</button>}
                </div>
            </div>
        </div >
    );
};

export default FarmPlot;