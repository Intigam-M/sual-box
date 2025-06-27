import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, NavLink } from "react-router-dom";
import classNames from "classnames";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../store/authStore";
import { SlEye } from "react-icons/sl";
import { TbEyeClosed } from "react-icons/tb";
import styles from "./login.module.css"; // Əgər register.css eynidirsə, onu import et
import { UserI } from "../../utils/types";

const schema = z.object({
    email: z.string().email({ message: "Email düzgün deyil" }),
    password: z.string().min(1, { message: "Şifrə tələb olunur" }),
});

type FormData = z.infer<typeof schema>;

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    const login = useAuth((state) => state.login);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const loginHandler = async (data: FieldValues) => {
        setLoading(true);
        setLoginError("");

        const { email, password } = data;

        const { data: signInData, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setLoginError(error.message);
            setLoading(false);
            return;
        }

        // Email təsdiqlənməyibsə daxil olmasın
        if (!signInData.user?.email_confirmed_at) {
            setLoginError("Email hələ təsdiqlənməyib.");
            setLoading(false);
            return;
        }

        if (signInData.user && signInData.session) {
            const user = {
                id: signInData.user.id,
                email: signInData.user.email,
                token: signInData.session.access_token,
            };

            login(user as UserI);
            navigate("/");
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <p className={styles.title}>Sual Box</p>

                <div className={styles.card}>
                    {loginError && <div className={styles.error}>{loginError}</div>}

                    <form onSubmit={handleSubmit(loginHandler)} className={styles.form}>
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
                            <div className={styles.eyeDiv}>
                                {showPassword ? (
                                    <SlEye className={styles.icon} onClick={() => setShowPassword(false)} />
                                ) : (
                                    <TbEyeClosed className={styles.icon} onClick={() => setShowPassword(true)} />
                                )}
                                <input type={showPassword ? "text" : "password"} id="password" placeholder="••••••••" className={styles.input} {...register("password")} />
                                {errors.password && <span className="inputErrormsg">{errors.password.message}</span>}
                            </div>
                        </div>

                        <input disabled={loading} type="submit" className={classNames(styles.button, { [styles.disabledBtn]: loading })} value={loading ? "Loading..." : "Log in"} />
                    </form>

                    <p className={styles.footerText}>
                        Don't have an account?{" "}
                        <NavLink to="/register" className={styles.link}>
                            Register
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
