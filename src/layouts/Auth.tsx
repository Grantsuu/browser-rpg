import { Outlet } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const Auth = () => {
    return (
        <div className="flex items-center justify-center w-full h-dvh">
            <div className="flex flex-col gap-4 w-full items-center justify-center">
                <div className="prose">
                    <h1>
                        Browser RPG <FontAwesomeIcon icon={faShieldHalved as IconProp} />
                    </h1>
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