import { useQuery } from "@tanstack/react-query";
import { getCharacter } from '../lib/apiClient';

export const useCharacter = () => useQuery({
    queryKey: ['character'],
    queryFn: getCharacter,
    retry: (failureCount, error) => {
        // Don't retry if character is not found the first time
        if (error.message === 'Not Found') return false;
        return failureCount < 3;
    }
});
