import type React from "react";
import MobileMenuStyles from './MobileMenu.module.scss'
import { links } from '../../../consts'
import { NavLink } from "react-router-dom";
import close from '../../../imgs/closeHiddenMenu.png'
import menuArrow from '../../../imgs/hiddenMenuArrow.png'

interface IProps {
    mobileMenuState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const HiddenMobileMenu: React.FC<IProps> = ({ mobileMenuState }) => {
    // открытие/закрытие меню
    const [hiddenMenu, setHiddenMenu] = mobileMenuState
    let menuStyles = MobileMenuStyles.mainHiddenMenuWrapper
    hiddenMenu ? menuStyles = MobileMenuStyles.mainHiddenMenuWrapper  + ' ' + MobileMenuStyles.closedHiddenMenu
    : menuStyles = MobileMenuStyles.mainHiddenMenuWrapper
    
    // ссылки меню
    const menuLinks = links.slice(3,)

    return <div className={menuStyles}>
        <div className={MobileMenuStyles.hiddenMenuHeader}>
            <p>Меню</p>
            <button onClick={() => setHiddenMenu(true)}>
                <img src={close} alt="close menu" />
            </button>
        </div>
        <div className={MobileMenuStyles.hiddenMenuContent}>
            {menuLinks.map((item, index) => {
                return <NavLink key={index} to={item.link} className={MobileMenuStyles.hiddenMenuItem}
                onClick={() => setHiddenMenu(true)}>
                    <p>{item.title}</p>
                    <img src={menuArrow} alt="menu arrow" />
                </NavLink>
            })}
        </div>
    </div>
}