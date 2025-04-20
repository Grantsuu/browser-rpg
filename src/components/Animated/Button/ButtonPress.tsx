import { motion } from "motion/react"
import { clsx } from "clsx";
import React from "react";

interface ButtonPressProps {
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

const ButtonPress = ({ type, className, disabled, onClick, children }: ButtonPressProps) => {
    return (
        <motion.button
            type={type}
            className={clsx(className ? `btn ${className}` : "btn")}
            onClick={onClick}
            disabled={disabled}
            whileTap={{ scale: 0.90 }}
            whileHover={{ scale: 1.05 }}
        >
            {disabled ? <span className="loading loading-spinner loading-sm self-center"></span> : children}
        </motion.button>
    );
};
export default ButtonPress;