import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Form, Formik, useField } from 'formik';
import * as Yup from 'yup';
import { postCreateCharacter } from '../../lib/apiClient';
import { useNavigate } from 'react-router';

const FormTextInput = ({ ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
    const [field, meta] = useField(props);
    return (
        <div className='mb-2'>
            <input className={props.className} {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="ml-1 text-xs text-red-600">{meta.error}</div>
            ) : null}
        </div>
    );
};
const CharacterCreate = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: postCreateCharacter,
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
        <Formik
            initialValues={{ name: '' }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .required('Required')
                    .min(3, 'Must be at least 3 characters')
                    .max(20, 'Must be 20 characters or less'),
            })}
            onSubmit={(values) => {
                mutate(values.name);
            }}
        >
            <Form>
                <FormTextInput
                    className='w-full p-2 border border-gray-300 rounded'
                    name='name'
                    type='text'
                    placeholder='Character Name'
                />
                <button
                    className='btn btn-primary w-full p-2 mt-2 text-white rounded'
                    type='submit'
                    disabled={isPending}
                >
                    {isPending ? <span className="loading loading-spinner loading-sm"></span> : 'Create Character'}
                </button>
            </Form>
        </Formik>
    );
}

export default CharacterCreate;