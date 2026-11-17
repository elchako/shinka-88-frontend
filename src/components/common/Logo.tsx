import type React from "react";
import { NavLink } from "react-router-dom";
import logo from '../../imgs/refresh/logo-refresh.png'

interface ILogoCSSProps {
    logoImg: string
    title: string
    logo: string
}

export const Logo: React.FC<ILogoCSSProps> = (styles) => {

    return <NavLink to='/' className={styles.logo} aria-label="Шинка88, главная">
        <div className={styles.logoImg}>
            <img src={logo} alt="" width="45" height="40" decoding="async" />
        </div>
        <p className={styles.title}>ШИНКА88.РФ</p>
    </NavLink>
}