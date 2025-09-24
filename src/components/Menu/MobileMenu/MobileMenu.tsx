import type React from "react";
import MobileMenuStyles from './MobileMenu.module.scss'
import { links } from '../../../consts'
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { mobileMenuReducer } from "../../../app/slices/common/smallActions";


export const MobileMenu: React.FC = () => {
    const dispatch = useAppDispatch()

    return <div className={MobileMenuStyles.mainWrapper}>
        <NavLink to={links[0].link} className={MobileMenuStyles.bottomMenuItem}>{links[0].title}</NavLink>
        <button className={MobileMenuStyles.bottomMenuItem}
            onClick={() => dispatch(mobileMenuReducer())}>Меню</button>
        {/* <p className={MobileMenuStyles.bottomMenuItem}>Заказы</p> */}
    </div>
}