import { useRef, useState } from 'react';
import { AnimatePresence, motion } from "motion/react"

interface CollapseProps {
    title: string;
    children: React.ReactNode;
};

const Collapse = ({ title, children }: CollapseProps) => {
    const [open, setOpen] = useState(true);
    const inputRef = useRef<HTMLInputElement>({ checked: false } as HTMLInputElement);
    return (
        <div className="border-1 border-base-300 rounded-lg">
            <div className="p-3"
                onClick={() => {
                    setOpen(!open);
                    if (inputRef.current) {
                        inputRef.current.checked = !open;
                    }
                }}>
                <div className="flex flex-row justify-between cursor-pointer">
                    <span className="text-2xl font-semibold">{title}</span>
                    <motion.div
                        className="flex items-center justify-center"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        <svg className="swap-off h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                        </svg>
                    </motion.div>
                </div>
                {open && <div className="divider m-0"></div>}
            </div>
            <AnimatePresence>
                {open && <motion.div
                    className="pl-3 pr-3 pb-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {/* Collapse Content goes in here */}
                    {children}
                </motion.div>}
            </AnimatePresence>
        </div>
    );
};

export default Collapse;