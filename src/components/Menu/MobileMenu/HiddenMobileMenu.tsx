import type React from "react";
import MobileMenuStyles from './MobileMenu.module.scss'
import { links } from '../../../consts'
import { NavLink } from "react-router-dom";
import close from '../../../imgs/closeHiddenMenu.png'
import menuArrow from '../../../imgs/hiddenMenuArrow.png'
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { mobileMenuReducer, mobileMenuSelector } from "../../../app/slices/common/smallActions";

export const HiddenMobileMenu: React.FC = () => {
    // открытие/закрытие меню
    const mobileMenuState = useAppSelector(mobileMenuSelector) // закрытие/открытие мобильного меню
    const dispatch = useAppDispatch()
    let menuStyles = MobileMenuStyles.mainHiddenMenuWrapper
    mobileMenuState ? menuStyles = MobileMenuStyles.mainHiddenMenuWrapper + ' ' + MobileMenuStyles.closedHiddenMenu
        : menuStyles = MobileMenuStyles.mainHiddenMenuWrapper

    // ссылки меню
    const menuLinks = [...links.slice(3, 5), ...links.slice(10,)]

    return <div className={menuStyles}>
        <div className={MobileMenuStyles.hiddenMenuHeader}>
            <p>Меню</p>
            <button onClick={() => dispatch(mobileMenuReducer())}>
                <img src={close} alt="close menu" />
            </button>
        </div>
        <div className={MobileMenuStyles.hiddenMenuContent}>
            {menuLinks.map((item, index) => {
                return <NavLink key={index} to={item.link} className={MobileMenuStyles.hiddenMenuItem}
                    onClick={() => dispatch(mobileMenuReducer())}>
                    <p>{item.title}</p>
                    <img src={menuArrow} alt="menu arrow" />
                </NavLink>
            })}
        </div>
    </div>
}