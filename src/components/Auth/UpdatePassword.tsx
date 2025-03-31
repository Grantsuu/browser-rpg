import { Link } from "react-router";
import AuthForm from "./AuthForm";

const UpdatePassword = () => {

    return (
        <div className="w-full md:w-1/2 xl:w-1/4">
            <div className="card rounded-box shadow-xl bg-base-200">
                <div className="card-body items-center">
                    <div className="prose">
                        <h2>
                            Update Password
                        </h2>
                    </div>
                    <AuthForm mode="update" />
                    <div className="prose">
                        <Link to="/login" className="text-xs xl:text-sm xxl:text-base">
                            Return to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdatePassword;