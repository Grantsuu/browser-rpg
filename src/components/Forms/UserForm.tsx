import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

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
    mode: "login" | "register";
}

const UserForm = ({ mode = "login" }: UserFormProps) => {
    return (
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
                        .required('Please confirm your password')
                        .oneOf([Yup.ref('password')], 'Passwords must match')
                })}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values);
                setSubmitting(false);
            }}
        >
            <Form className="w-full">
                <FormTextInput
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="input"
                />
                <FormTextInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="input"
                />
                {
                    mode === "register" &&
                    <FormTextInput
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        className="input"
                    />
                }
                <div className="flex justify-center">
                    <button type="submit" className="btn btn-primary mb-2">
                        {
                            mode === "login" ? "Login" : "Register"
                        }
                    </button>
                </div>
            </Form>
        </Formik >
    )
}

export default UserForm;