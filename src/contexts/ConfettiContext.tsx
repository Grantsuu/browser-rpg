import React, { createContext, useState, useContext } from 'react';
import Confetti from 'react-confetti';

interface ConfettiContextProps {
    isRunning: boolean;
    startConfetti: () => void;
    stopConfetti: () => void;
    levelUpConfetti: () => void;
}

const ConfettiContext = createContext<ConfettiContextProps | undefined>(undefined);

const ConfettiProvider = ({ children }: { children: React.ReactNode }) => {
    const [isRunning, setIsRunning] = useState(false);

    const startConfetti = () => {
        setIsRunning(true);
    };

    const stopConfetti = () => {
        setIsRunning(false);
    };

    const levelUpConfetti = () => {
        startConfetti();
        setTimeout(() => {
            stopConfetti();
        }, 10000);
    }

    const value: ConfettiContextProps = {
        isRunning,
        startConfetti,
        stopConfetti,
        levelUpConfetti
    };

    return (
        <ConfettiContext value={value} >
            {children}
            {isRunning && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} tweenDuration={2500} numberOfPieces={750} />}
        </ConfettiContext>
    );
};

const useConfetti = () => {
    const context = useContext(ConfettiContext);
    if (!context) {
        throw new Error('useConfetti must be used within a ConfettiProvider');
    }
    return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { ConfettiProvider, useConfetti };