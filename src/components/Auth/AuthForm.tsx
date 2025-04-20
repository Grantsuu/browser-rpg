import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { postLogin } from '../../lib/apiClient';

interface UserFormProps {
    mode: "login" | "register" | "reset" | "update";
}

const redirectUrl = import.meta.env.VITE_SUPABASE_REDIRECT;

const AuthForm = ({ mode = "login" }: UserFormProps) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const AuthFormSchema = z.object({
        email: ((mode === "login" || mode === "register" || mode === "reset") ?
            z.string()
                .email('Please enter a valid email address')
                .nonempty('Please enter your email address') :
            z.string().optional()),
        password: ((mode === "login" || mode === "register" || mode === "update") ?
            z.string()
                .min(8, 'Please enter at least 8 characters')
                .nonempty('Please enter your password') :
            z.string().optional()),
        confirmPassword: ((mode === "register" || mode === "update") ?
            z.string()
                .nonempty('Please confirm your password') :
            z.string().optional()),
    })
        .superRefine((val, ctx) => {
            if ((mode === "register" || mode === "update") && (val.password !== val.confirmPassword)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Passwords must match',
                    path: ['confirmPassword'],
                })
            }
        })

    type AuthFormValues = z.infer<typeof AuthFormSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<AuthFormValues>({
        resolver: zodResolver(AuthFormSchema),
    });

    const onSubmit: SubmitHandler<AuthFormValues> = async (data) => {
        if (mode === 'register') {
            await handleRegister(data.email as string, data.password as string);
        } else if (mode === 'login') {
            await handleLogin(data.email as string, data.password as string);
        } else if (mode === 'reset') {
            await handleResetPassword(data.email as string);
        } else if (mode === 'update') {
            await handleUpdatePassword(data.password as string);
        }
    }

    const handleRegister = async (email: string, password: string) => {
        //     const { error } = await supabaseClient.auth.signUp({
        //         email: email,
        //         password: password,
        //         options: {
        //             emailRedirectTo: redirectUrl,
        //         },
        //     })
        //     if (error) {
        //         toast.error(`Error registering: ${error.message}. Please try again later.`);
        //     } else {
        //         setRegisterSuccess(true);
        //     }
        // }
    }

    const handleLogin = async (email: string, password: string) => {
        try {
            await postLogin(email, password);
            queryClient.resetQueries({ queryKey: ['character'] });
            navigate("/");
        } catch (error) {
            if (error)
                toast.error(`Unable to log in: ${error}. Please try again later.`);
        }
    }

    const handleResetPassword = async (email: string) => {
        // const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        //     redirectTo: `${redirectUrl}/account/update-password`,
        // })
        // if (error) {
        //     toast.error(`Error requesting password reset: ${error.message}`);
        // } else {
        //     toast.success(`Password reset request successful. Please check your email.`);
        // }
    }

    const handleUpdatePassword = async (password: string) => {
        // const { error } = await supabaseClient.auth.updateUser({ password: password })
        // if (error) {
        //     toast.error(`Error updating password: ${error.message}`);
        // } else {
        //     toast.success(`Password update successful.`);
        // }
    }

    // Display success message if registration is successful
    if (registerSuccess) {
        return (
            <div className="flex flex-col text-center justify-center prose">
                <FontAwesomeIcon icon={faCircleCheck as IconProp} size="5x" color="green" />
                <h2 className="mt-4">
                    Registration successful!
                </h2>
                <p>Please check your email to confirm your account.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
            {/* Email */}
            {(mode === "login" || mode === "register" || mode === "reset") &&
                <>
                    <input
                        className='input w-full p-2 border border-gray-300'
                        type='email'
                        placeholder='Email'
                        disabled={isSubmitting}
                        {...register('email')}
                    />
                    {/* Email Error Output */}
                    {errors.email && <span className="ml-1 text-xs text-error">{errors.email.message}</span>}
                </>
            }

            {/* Password */}
            {(mode === "login" || mode === "register" || mode === "update") &&
                <>
                    <input
                        className='input w-full p-2 mt-2 border border-gray-300'
                        type='password'
                        placeholder='Password'
                        disabled={isSubmitting}
                        {...register('password')}
                    />
                    {/* Password Error Output */}
                    {errors.password && <span className="ml-1 text-xs text-error">{errors.password.message}</span>}
                </>
            }

            {/* Confirm Password */}
            {(mode === "register" || mode === "update") &&
                <>
                    <input
                        className='input w-full p-2 mt-2 border border-gray-300'
                        type='password'
                        placeholder='Confirm password'
                        disabled={isSubmitting}
                        {...register('confirmPassword')}
                    />
                    {/* Confirm Password Error Output */}
                    {errors.confirmPassword &&
                        <span className="ml-1 text-xs text-error">{errors.confirmPassword.message}</span>}
                </>
            }

            {/* Submit Button */}
            <button
                className='btn btn-primary w-full p-2 my-2 text-white'
                type='submit'
                disabled={isSubmitting}
            >
                {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> :
                    mode === 'login' ? 'Login' :
                        mode === 'register' ? 'Register' :
                            mode === 'reset' ? 'Reset Password' :
                                mode === 'update' ? 'Update Password' : ''
                }
            </button>
        </form>
    )
}

export default AuthForm;