import { useState } from "react";
import ButtonPress from "@components/Animated/Button/ButtonPress";
import React from "react";

interface ConfirmButtonProps {
    confirmContent: React.ReactNode;
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
    onClick?: () => void;
    children: React.ReactNode;
}

const ConfirmButton = ({ confirmContent, className, onClick, children }: ConfirmButtonProps) => {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleClick = () => {
        if (isConfirming) {
            onClick?.();
            setIsConfirming(false);
        } else {
            setIsConfirming(true);
        }
    }

    return (
        <ButtonPress className={className} onClick={handleClick} onBlur={() => setIsConfirming(false)}>
            {isConfirming ? confirmContent : children}
        </ButtonPress>
    );
};

export default ConfirmButton;