import { useQuery } from "@tanstack/react-query";
import { getCharacter, getCharacterInventory } from './apiClient';

export const useCharacter = () => useQuery({
    queryKey: ['character'],
    queryFn: getCharacter,
    retryOnMount: false,
    retry: (failureCount, error) => {
        // Don't retry if character is not found the first time
        if (error.message === 'Not Found') return false;
        return failureCount < 3;
    }
});

export const useInventory = () => useQuery({
    queryKey: ['inventory'],
    queryFn: getCharacterInventory
});