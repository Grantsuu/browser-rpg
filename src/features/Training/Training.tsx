import { clsx } from 'clsx';
import PageCard from "../../layouts/PageCard";
import ResponsiveCardGrid from "../../components/Responsive/ResponsiveCardGrid";

// interface TrainingProps {
// { }: TrainingProps
// }

const Training = () => {
    return (
        <PageCard title="Training" icon={"images/swords.png"}>
            {/* <h1>Training</h1>
            <p>Train your skills here!</p> */}
            <ResponsiveCardGrid>
                <div className={clsx("card w-full bg-base-100 shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out")}>
                    <div className="card-body">
                        <h2 className="card-title self-center">Farmstead  <div className="badge bg-green-500 text-white">Easy</div></h2>
                        <img src="images/barn.png" className="w-1/3 self-center" />
                        {/* <p className="text-sm text-center font-normal">Though the threats are minor, the farmstead is the perfect place for fresh heroes to test their steel, hone their reflexes, and earn their first taste of glory.</p> */}
                        <button className="btn btn-primary">Train</button>
                    </div>
                </div>
                <div className={clsx("card w-full bg-base-100 shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out")}>
                    <div className="card-body">
                        <h2 className="card-title self-center">Haunted Graveyard  <div className="badge bg-yellow-400 text-white">Normal</div></h2>
                        <img src="images/cemetery.png" className="w-1/3 self-center" />
                        <button className="btn btn-primary">Train</button>
                    </div>
                </div>
                <div className={clsx("card w-full bg-base-100 shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out pointer-events-none bg-gray-300")}>
                    <div className="card-body">
                        <h2 className="card-title self-center">Dreadspire Keep  <div className="badge bg-red-600 text-white">Hard</div></h2>
                        <img src="images/castle.png" className="w-1/3 self-center" />
                        <button className="btn btn-primary" disabled>Required Level: 25</button>
                    </div>
                </div>
            </ResponsiveCardGrid>
        </PageCard>
    );
};
export default Training;