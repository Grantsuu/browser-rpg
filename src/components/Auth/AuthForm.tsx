import { useContext, useState } from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { SupabaseContext } from "../../contexts/SupabaseContext";
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
    mode: "login" | "register" | "reset";
}

const AuthForm = ({ mode = "login" }: UserFormProps) => {
    const supabase = useContext(SupabaseContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const handleRegister = async (email: string, password: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // emailRedirectTo: 'https://example.com/welcome',
            },
        })
        if (error) {
            setErrorMessage(`Error registering: ${error.message}. Please try again later.`);
        } else {
            setRegisterSuccess(true);
        }
        setLoading(false);
    }

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) {
            setErrorMessage(`Error logging in: ${error.message}. Please try again later.`);
        }
        // Only redirect if a valid user is logged in
        if (user) {
            navigate("/");
        }
        setLoading(false);
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
                            email: Yup.string()
                                .email('Please enter a valid email address')
                                .required('Please enter your email address'),
                            password: Yup.string()
                                .required('Please enter a valid password')
                                .when([], {
                                    is: () => mode.includes("register"),
                                    then: (schema) => schema.min(8, "Please enter at least 8 characters"),
                                }),
                            confirmPassword: Yup.string()
                                .when([], {
                                    is: () => mode.includes("register"),
                                    then: (schema) => schema.required('Please confirm your password')
                                        .oneOf([Yup.ref('password')], 'Passwords must match')
                                })
                        })}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        if (mode === 'register') {
                            await handleRegister(values.email, values.password);
                        } else if (mode === 'login') {
                            await handleLogin(values.email, values.password);
                        }
                        setSubmitting(false);
                    }}
                >
                    <Form className="w-full">
                        <FormTextInput
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input"
                            disabled={loading}
                        />
                        {mode !== "reset" && <FormTextInput
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="input"
                            disabled={loading}
                        />}
                        {
                            mode === "register" &&
                            <FormTextInput
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm password"
                                className="input"
                                disabled={loading}
                            />
                        }
                        <div className="flex justify-center">
                            <button type="submit" className="btn btn-primary mb-2">
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