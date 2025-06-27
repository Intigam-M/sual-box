import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../store/authStore";
import styles from "./navbar.module.css";

function Navbar() {
    const logout = useAuth((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className={styles.navbar}>
            <h1 className={styles.logo}>Sual Box</h1>
            <nav className={styles.nav}>
                <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : "")}>
                    Quiz
                </NavLink>
                <NavLink to="/review" className={({ isActive }) => (isActive ? styles.active : "")}>
                    Review
                </NavLink>
                <NavLink to="/create" className={({ isActive }) => (isActive ? styles.active : "")}>
                    Create Card
                </NavLink>
                <NavLink to="/manage" className={({ isActive }) => (isActive ? styles.active : "")}>
                    Manage
                </NavLink>
                <button onClick={handleLogout} className={styles.signOut}>
                    Sign Out
                </button>
            </nav>
        </header>
    );
}

export default Navbar;
