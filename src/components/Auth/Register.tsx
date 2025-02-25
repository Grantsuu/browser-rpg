import { Link } from "react-router";
import AuthForm from "./AuthForm";

const Register = () => {
    return (
        <div className="flex flex-col items-center prose">
            <h2>
                Register
            </h2>
            <AuthForm mode="register" />
            <Link to="/login" className="text-xs">
                Return to login
            </Link>
        </div>
    )
}

export default Register;