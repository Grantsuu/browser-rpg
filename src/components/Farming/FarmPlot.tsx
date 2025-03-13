const FarmPlot = () => {
    return (
        <div className="card w-full bg-base-100 card-lg shadow-sm">
            <div className="card-body">
                <div className="flex w-full items-center justify-center">
                    <h2 className="card-title text-center">Farm Plot</h2>
                </div>
                <div className="flex justify-center">
                    <img src="/shield-halved-solid.svg" className="w-25" />
                </div>
                <div className="prose">
                    <div><b>Status:</b> Inactive, Growing, Ready to Harvest</div>
                    <div><b>Contents:</b> Wheat Seeds</div>
                    <div className="flex flew-row items-baseline gap-2">
                        <div><b>Progress:</b></div>
                        <progress className="progress progress-success w-full" value="100" max="100"></progress>
                        30s
                    </div>
                </div>
                <div className="justify-center card-actions">
                    <button className="btn btn-primary btn-wide">Plant Seeds</button>
                    <button className="btn btn-error btn-wide">Cancel</button>
                    <button className="btn btn-secondary btn-wide">Harvest</button>
                </div>
            </div>
        </div >
    );
};

export default FarmPlot;