import { Link } from "react-router";
import UserForm from "../Forms/UserForm";

const Login = () => {
    return (
        <div className="flex flex-col items-center prose">
            <h2>
                Login
            </h2>
            <UserForm mode="login" />
            <Link to="/reset-password" className="text-xs mb-1">
                Forgot password?
            </Link>
            <Link to="/register" className="text-xs">
                Register a new account
            </Link>
        </div>
    )
}

export default Login;