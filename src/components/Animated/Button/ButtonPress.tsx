import { motion } from "motion/react"
import { clsx } from "clsx";

interface ButtonPressProps {
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

const ButtonPress = ({ className, disabled, onClick, children }: ButtonPressProps) => {
    return (
        <motion.button
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