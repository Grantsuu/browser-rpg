import { Link } from "react-router";
import UserForm from "../Forms/UserForm";

const Register = () => {
    return (
        <div className="flex flex-col items-center prose">
            <h2>
                Register
            </h2>
            <UserForm mode="register" />
            <Link to="/login" className="text-xs">
                Return to login
            </Link>
        </div>
    )
}

export default Register;