import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { postCreateCharacter } from '@lib/apiClient';
import { useNavigate } from 'react-router';

const CharacterCreateSchema = z.object({
    name: z.string()
        .min(3, { message: 'Must be at least 3 characters' })
        .max(20, { message: 'Must be 20 characters or less' })
        .nonempty({ message: 'Required' }),
});

type CharacterCreateFormValues = z.infer<typeof CharacterCreateSchema>;

const CharacterCreate = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CharacterCreateFormValues>({
        resolver: zodResolver(CharacterCreateSchema),
    });

    const onSubmit: SubmitHandler<CharacterCreateFormValues> = async (data) => {
        await mutateAsync(data);
    };

    const { mutateAsync } = useMutation({
        mutationFn: (variables: { name: string }) => postCreateCharacter(variables.name),
        onSuccess: () => {
            toast.success('Character created successfully!');
            queryClient.invalidateQueries({ queryKey: ['character'] });
            navigate('/character');
        },
        onError: (error: Error) => {
            toast.error(`Something went wrong creating the character: ${error.message}`);
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full'>
            {/* Name */}
            <input
                className='input w-full p-2 border border-gray-300'
                type='text'
                placeholder='Character Name'
                disabled={isSubmitting}
                {...register('name')}
            />
            {/* Error Output */}
            {errors.name && <span className="ml-1 text-xs text-error">{errors.name.message}</span>}
            {/* Submit Button */}
            <button
                className='btn btn-primary w-full p-2 mt-2 text-white'
                type='submit'
                disabled={isSubmitting}
            >
                {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Create Character'}
            </button>
        </form>
    );
}

export default CharacterCreate;