import { motion } from "motion/react"

interface ColumnDelayDownProps {
    children: React.ReactNode;
    index: number;
}

const ColumnDelayDown = ({ children, index }: ColumnDelayDownProps) => {
    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, delay: 0.3 + index * 0.1, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}
export default ColumnDelayDown;