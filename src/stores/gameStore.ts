import { create } from 'zustand';
import type { Bounty } from '@src/types';

interface GameState {
    trackedBounty: Bounty | undefined;
    setTrackedBounty: (bounty: Bounty | undefined) => void;
}

export const useGameStore = create<GameState>()((set) => ({
    trackedBounty: undefined,
    setTrackedBounty: (bounty) => set(() => ({ trackedBounty: bounty })),
}));