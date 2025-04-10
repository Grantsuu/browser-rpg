import { createContext, useContext, useState } from 'react';

interface TimersContextProps {
    timers: object;
    createTimer: (name: string, callback: () => void, delay: number) => void;
    removeTimer: (name: string) => void;
}

const TimersContext = createContext<TimersContextProps | undefined>(undefined);

const TimersProvider = ({ children }: { children: React.ReactNode }) => {
    const [timers, setTimers] = useState({});

    const createTimer = (name: string, callback: () => void, delay: number) => {
        const timerId = setTimeout(callback, delay);
        setTimers(prevTimers => ({ ...prevTimers, [name]: timerId }));
    }

    const removeTimer = (name: string) => {
        clearTimeout(timers[name as keyof typeof timers]);
        setTimers(prevTimers => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [name as keyof typeof timers]: removedTimer, ...remainingTimers } = prevTimers;
            return remainingTimers;
        });
    };

    const value: TimersContextProps = {
        timers,
        createTimer,
        removeTimer
    };

    return (
        <TimersContext.Provider value={value}>
            {children}
        </TimersContext.Provider>
    );
}

const useTimers = () => {
    const context = useContext(TimersContext);
    if (!context) {
        throw new Error('useTimers must be used within a TimersProvider');
    }
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { TimersProvider, useTimers };