import { Link } from "react-router";
import AuthForm from "./AuthForm";

const UpdatePassword = () => {

    return (
        <div className="w-1/5">
            <div className="card rounded-box shadow-xl bg-base-200">
                <div className="card-body">
                    <div className="flex flex-col items-center prose">
                        <h2>
                            Update Password
                        </h2>
                        <AuthForm mode="update" />
                        <Link to="/login" className="text-xs">
                            Return to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdatePassword;