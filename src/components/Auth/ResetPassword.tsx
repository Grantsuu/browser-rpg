import { Link } from "react-router";
import UserForm from "../Forms/UserForm";

const ResetPassword = () => {

    return (
        <div className="flex flex-col items-center prose">
            <h2>
                Reset Password
            </h2>
            <UserForm mode="reset" />
            <Link to="/login" className="text-xs">
                Return to login
            </Link>
        </div>
    )
}

export default ResetPassword;