import { Link } from "react-router";

const Login = () => {
    return (
        <div className="flex flex-col items-center prose">
            <h2>
                Login
            </h2>
            <input type="email" placeholder="Email" className="input mb-2" />
            <input type="password" placeholder="Password" className="input mb-2" />
            <div className="card-actions justify-center">
                <button className="btn btn-primary mb-2">Login</button>
            </div>
            <Link to="/register" className="text-xs">
                Register a new account
            </Link>
        </div>
    )
}

export default Login;