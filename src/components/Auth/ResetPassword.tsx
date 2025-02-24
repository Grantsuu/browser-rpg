import { Link } from "react-router";
import AuthForm from "./AuthForm";

const ResetPassword = () => {

    return (
        <div className="flex flex-col items-center prose">
            <h2>
                Reset Password
            </h2>
            <AuthForm mode="reset" />
            <Link to="/login" className="text-xs">
                Return to login
            </Link>
        </div>
    )
}

export default ResetPassword;