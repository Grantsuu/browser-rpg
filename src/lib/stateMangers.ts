import { useQuery } from "@tanstack/react-query";
import { getCharacter, getCharacterInventory } from './apiClient';

export const useCharacter = () => useQuery({
    queryKey: ['character'],
    queryFn: getCharacter,
    // retryOnMount: false,
    retry: 1
});

export const useInventory = () => useQuery({
    queryKey: ['inventory'],
    queryFn: getCharacterInventory
});