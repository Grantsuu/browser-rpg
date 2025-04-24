import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ResponsiveDrawerProps {
    children: React.ReactNode;
    title: string;
    icon?: string | IconProp;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const ResponsiveDrawer = ({ children, title, icon, open, setOpen }: ResponsiveDrawerProps) => {
    return (
        <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" checked={open} onChange={() => { }} />
            <div className="drawer-side z-2">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay" onClick={() => setOpen(false)} />
                <ul className="menu bg-base-200 text-base-content h-full w-85 lg:w-1/3 p-4 overflow-y-scroll">
                    <div className="flex flex-col gap-4 h-full">
                        <div className="flex flex-row items-center">
                            <div className="flex flex-row gap-2 justify-center items-center text-3xl">
                                {(typeof icon === "object") && <FontAwesomeIcon icon={icon as IconProp} />}
                                {(typeof icon === "string") && <img src={icon} alt="icon" className="w-1/12" />}
                                <h2 className="font-bold">{title}</h2>
                            </div>
                            <button className="btn btn-circle btn-ghost" onClick={() => setOpen(false)}><FontAwesomeIcon icon={faXmark as IconProp} /></button>
                        </div>
                        {children}
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default ResponsiveDrawer;