import type React from "react";
import DesktopMenuStyles from './DesktopMenu.module.scss'
import { links } from '../../../consts'
import { NavLink } from "react-router-dom";


export const DesktopMenu: React.FC = () => {
    return <div className={DesktopMenuStyles.mainWrapper}>
        <div className={DesktopMenuStyles.mainMenu}>
            <div className={DesktopMenuStyles.leftMenu}>
                <NavLink to={links[3].link}>{links[3].title}</NavLink>
                <NavLink to={links[4].link}>{links[4].title}</NavLink>
                <NavLink to={links[5].link}>{links[5].title}</NavLink>
                <NavLink to={links[6].link}>{links[6].title}</NavLink>
            </div>
            <div className={DesktopMenuStyles.rightMenu}>
                <NavLink to={links[7].link}>{links[7].title}</NavLink>
                <NavLink to={links[8].link}>{links[8].title}</NavLink>
                <NavLink to={links[9].link}>{links[9].title}</NavLink>
            </div>
        </div>
    </div>
}