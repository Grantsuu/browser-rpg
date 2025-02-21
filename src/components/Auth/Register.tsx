import { Link } from "react-router";

const Register = () => {
    return (
        <div className="flex flex-col items-center prose">
            <h2>
                Register
            </h2>
            <input type="email" placeholder="Email" className="input mb-2" />
            <input type="password" placeholder="Password" className="input mb-2" />
            <input type="password" placeholder="Confirm password" className="input mb-2" />
            <div className="card-actions justify-center">
                <button className="btn btn-primary mb-2">Register</button>
            </div>
            <Link to="/login" className="text-xs">
                Return to login
            </Link>
        </div>
    )
}

export default Register;