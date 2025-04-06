interface LevelUpToastProps {
    level: number;
    skill: string;
}

const LevelUpToast = ({ level, skill }: LevelUpToastProps) => {
    return (
        <div className='flex flex-row w-full justify-between items-center gap-1'>
            <div>
                Congratulations! Your <span className="text-blue-500">{skill}</span> has advanced to level <b>{level}</b>!
            </div>
            <div className="w-1/4">
                <img src={`/images/level_up.svg`} alt={`level up`} title={`level up`} />
            </div>
        </div>
    );
}

export default LevelUpToast;