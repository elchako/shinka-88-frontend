import type React from "react";
import MobileMenuStyles from './MobileMenu.module.scss'
import { links } from '../../../consts'
import { NavLink } from "react-router-dom";

interface IProps {
    mobileMenuState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const MobileMenu: React.FC<IProps> = ({ mobileMenuState }) => {
    // открытие/закрытие меню
    const setHiddenMenu = mobileMenuState[1]

    return <div className={MobileMenuStyles.mainWrapper}>
        <NavLink to={links[0].link} className={MobileMenuStyles.bottomMenuItem}>{links[0].title}</NavLink>
        <button className={MobileMenuStyles.bottomMenuItem}
            onClick={() => setHiddenMenu(false)}>Меню</button>
        <p className={MobileMenuStyles.bottomMenuItem}>Заказы</p>
    </div>
}