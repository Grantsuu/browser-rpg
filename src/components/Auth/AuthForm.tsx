import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useSupabase } from "../../contexts/SupabaseContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

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

interface UserFormProps {
    mode: "login" | "register" | "reset" | "update";
}

const redirectUrl = import.meta.env.VITE_SUPABASE_REDIRECT;

const AuthForm = ({ mode = "login" }: UserFormProps) => {
    const queryClient = useQueryClient();
    const { supabaseClient } = useSupabase();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const handleRegister = async (email: string, password: string) => {
        if (supabaseClient) {
            setLoading(true);
            const { error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: redirectUrl,
                },
            })
            if (error) {
                setErrorMessage(`Error registering: ${error.message}. Please try again later.`);
            } else {
                setRegisterSuccess(true);
            }
            setLoading(false);
        }
    }

    const handleLogin = async (email: string, password: string) => {
        if (supabaseClient) {
            setLoading(true);
            const { data: { user }, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if (error) {
                setErrorMessage(`Error logging in: ${error.message}. Please try again later.`);
            }
            // Only redirect if a valid user is logged in
            if (user) {
                queryClient.invalidateQueries({ queryKey: ["character"] });
                navigate("/");
            }
            setLoading(false);
        }
    }

    const handleResetPassword = async (email: string) => {
        if (supabaseClient) {
            setLoading(true);
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: `${redirectUrl}/account/update-password`,
            })
            if (error) {
                setErrorMessage(`Error requesting password reset: ${error.message}`);
            } else {
                setErrorMessage(`Password reset request succesful. Please check your email.`)
            }
            setLoading(false);
        }
    }

    const handleUpdatePassword = async (password: string) => {
        if (supabaseClient) {
            setLoading(true);
            const { error } = await supabaseClient.auth.updateUser({ password: password })
            if (error) {
                setErrorMessage(`Error updating password: ${error.message}`);
            } else {
                setErrorMessage(`Password update successful.`)
            }
            setLoading(false);
        }
    }

    return (
        <>
            {registerSuccess ?
                <div className="flex flex-col text-center justify-center prose">
                    <FontAwesomeIcon icon={faCircleCheck as IconProp} size="5x" color="green" />
                    <h2 className="mt-4">
                        Registration successful!
                    </h2>
                    <p>Please check your email to confirm your account.</p>
                </div>
                :
                <Formik
                    initialValues={{
                        email: '', password: '', confirmPassword: ''
                    }}
                    validationSchema={
                        Yup.object({
                            // Email: login, register, reset
                            email: Yup.string()
                                .when([], {
                                    is: () => !mode.includes("update"),
                                    then: (schema) => schema
                                        .email('Please enter a valid email address')
                                        .required('Please enter your email address')
                                }),
                            // Password: login, register, update
                            password: Yup.string()
                                .when([], {
                                    is: () => !mode.includes("reset"),
                                    then: (schema) => schema.required('Please enter a valid password')
                                })
                                // Only need to validate minimum password length on registration
                                .when([], {
                                    is: () => mode.includes("register"),
                                    then: (schema) => schema.min(8, "Please enter at least 8 characters"),
                                }),
                            // Password: register, update
                            confirmPassword: Yup.string()
                                .when([], {
                                    is: () => mode.includes("register") || mode.includes("update"),
                                    then: (schema) => schema
                                        .required('Please confirm your password')
                                        .oneOf([Yup.ref('password')], 'Passwords must match')
                                })
                        })}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        if (mode === 'register') {
                            await handleRegister(values.email, values.password);
                        } else if (mode === 'login') {
                            await handleLogin(values.email, values.password);
                        } else if (mode === 'reset') {
                            await handleResetPassword(values.email);
                        } else if (mode === 'update') {
                            await handleUpdatePassword(values.password);
                        }
                        setSubmitting(false);
                    }}
                >
                    <Form className="w-full items-center">
                        {/* Email: login, register, reset */}
                        {mode !== "update" && <FormTextInput
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input w-full"
                            disabled={loading}
                        />}
                        {/* Password: login, register, update */}
                        {mode !== "reset" && <FormTextInput
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="input w-full"
                            disabled={loading}
                        />}
                        {/* Confirm Password: register, update */}
                        {(mode === "register" || mode === "update") &&
                            <FormTextInput
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm password"
                                className="input w-full"
                                disabled={loading}
                            />}
                        <div className="flex justify-center">
                            <button type="submit" className="btn btn-primary mb-2" disabled={loading}>
                                {
                                    loading ? <span className="loading loading-spinner loading-sm"></span> :
                                        mode === "login" ? "Login" :
                                            mode === "register" ? "Register" :
                                                "Reset Password"
                                }
                            </button>
                        </div>
                        {errorMessage &&
                            <div className="text-md text-center mb-1 text-red-700">
                                {errorMessage}
                            </div>
                        }
                    </Form>
                </Formik >}
        </>
    )
}

export default AuthForm;