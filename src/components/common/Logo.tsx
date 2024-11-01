import type React from "react";
import { NavLink } from "react-router-dom";
import logo from '../../imgs/logo.svg'

interface ILogoCSSProps {
    logoImg: string
    title: string
    logo: string
}

export const Logo: React.FC<ILogoCSSProps> = (styles) => {

    return <NavLink to='/' className={styles.logo}>
        <div className={styles.logoImg}>
            <img src={logo} alt="logo" />
        </div>
        <p className={styles.title}>ШИНКА88.РФ</p>
    </NavLink>
}