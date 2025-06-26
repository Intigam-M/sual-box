import azrcLogo from "../../assets/images/AZRC_logo.png";
import { useState } from "react";
import useAuth from "../../store/authStore";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { SlEye } from "react-icons/sl";
import { TbEyeClosed } from "react-icons/tb";
import styles from "./login.module.css";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { NavLink } from "react-router-dom";

const schema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof schema>;

function LoginPage() {
    const [loginError, setLoginError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const login = useAuth((state) => state.login);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const loginHandler = (data: FieldValues) => {
        setLoading(true);
        // axios
        //     .post("/login/", data)
        //     .then((response) => {
        //         login(response.data);
        //         navigate("/");
        //     })
        //     .catch((error) => {
        //         if (error.response) {
        //             setLoginError(error.response.data.message);
        //         } else {
        //             setLoginError(error.message);
        //         }
        //     })
        //     .finally(() => {
        //         setLoading(false);
        //     });
    };

    return (
        <div>
            <section className={styles.container}>
                <div className={styles.wrapper}>
                    <img src={azrcLogo} alt="Logo" className={styles.logo} />
                    <p className={styles.title}>Sual app</p>
                    <div className={styles.card}>
                        <div>
                            {loginError && <div className={styles.error}>{loginError}</div>}

                            <form onSubmit={handleSubmit(loginHandler)} className={styles.form}>
                                <div>
                                    <label htmlFor="email" className={styles.label}>
                                        Your email
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

                                    <input disabled={loading} type="submit" className={classNames(styles.button, { [styles.disabledBtn]: loading })} value={loading ? "Loading..." : "Log in"} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LoginPage;
