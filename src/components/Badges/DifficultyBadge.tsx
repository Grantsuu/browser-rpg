import { clsx } from 'clsx';

export type Difficulty = 'easy' | 'normal' | 'hard';

interface DifficultyBadgeProps {
    difficulty: Difficulty;
    disabled?: boolean;
}

const DifficultyBadge = ({ difficulty, disabled = false }: DifficultyBadgeProps) => {
    return (
        <div className={clsx(
            "badge badge-sm text-white",
            { "bg-gray-400": disabled },
            { "bg-green-500": !disabled && difficulty === 'easy' },
            { "bg-yellow-400": !disabled && difficulty === 'normal' },
            { "bg-red-600": !disabled && difficulty === 'hard' },

        )}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </div>
    );
};

export default DifficultyBadge;