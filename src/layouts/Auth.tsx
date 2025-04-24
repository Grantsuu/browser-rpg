import { Outlet } from "react-router";

const Auth = () => {
    return (
        <div className="flex items-center justify-center w-full h-dvh">
            <div className="flex flex-col gap-4 w-full items-center justify-center">
                <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold">Elvard</span> <img src="/dragon.png" className="inline-block w-12 h-12" alt="Elvard" />
                </div>
                <div className="w-full md:w-1/2 lg:w-1/4 xl:w-1/5">
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