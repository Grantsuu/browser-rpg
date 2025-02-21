import { Outlet } from "react-router";

const Auth = () => {
    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <div className="flex flex-col gap-4 w-full items-center justify-center">
                <div className="prose">
                    <h1>
                        Browser RPG
                    </h1>
                </div>
                <div className="w-1/5">
                    <div className="card rounded-box shadow-xl bg-base-200">
                        <div className="card-body">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Auth;