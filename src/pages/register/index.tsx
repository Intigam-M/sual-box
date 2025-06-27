import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useNavigate, NavLink } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Swal from "sweetalert2";
import styles from "./register.module.css";

const schema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const registerHandler = async (data: FieldValues) => {
        setLoading(true);
        setRegisterError("");

        const { email, password } = data;

        const { data: signUpData, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setRegisterError(error.message);
            setLoading(false);
            return;
        }

        if (signUpData.user && signUpData.session) {
            navigate("/");
            Swal.fire({
                icon: "success",
                title: "Registration completed",
                text: "You have successfully logged in!",
                timer: 2000,
                showConfirmButton: false,
            });
        } else {
            Swal.fire({
                icon: "info",
                title: "Confirmation Email Sent",
                text: "Please check your email to verify your account.",
            });
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <p className={styles.title}>Sual Box</p>

                <div className={styles.card}>
                    {registerError && <div className={styles.error}>{registerError}</div>}

                    <form onSubmit={handleSubmit(registerHandler)} className={styles.form}>
                        <div>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <input type="email" id="email" className={styles.input} placeholder="name@company.com" {...register("email")} />
                            {errors.email && <span className="inputErrormsg">{errors.email.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="password" className={styles.label}>
                                Password
                            </label>
                            <input type="password" id="password" className={styles.input} placeholder="••••••••" {...register("password")} />
                            {errors.password && <span className="inputErrormsg">{errors.password.message}</span>}
                        </div>

                        <input disabled={loading} type="submit" className={classNames(styles.button, { [styles.disabledBtn]: loading })} value={loading ? "Loading..." : "Register"} />
                    </form>

                    <p className={styles.footerText}>
                        Already have an account?
                        <NavLink to="/login" className={styles.link}>
                            Log in
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
