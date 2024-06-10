import type React from "react";
import HeaderStyles from "./HeaderStyles.module.scss";
import { NavLink } from "react-router-dom";
import cart from '../../imgs/cart/desktopHeader.png'
import { Logo } from "../common/Logo";
import { links } from "../../consts";
import { useAppSelector } from "../../app/hooks";
import { priceAmountSelector, tyresDataSelector } from "../pages/cart/cartSlice";


export const DesktopHeader: React.FC = () => {
    const priceAmount = useAppSelector(priceAmountSelector)

    const logoStyles = {
        logoImg: HeaderStyles.logoImg,
        title: HeaderStyles.title,
        logo: HeaderStyles.logo
    }

    return <div className={HeaderStyles.mainWrapper}>
        <Logo {...logoStyles} />
        <div className={HeaderStyles.data}>
            <p className={HeaderStyles.phone}><a href={links[2].link}>{links[2].title}</a></p>
            <NavLink to={links[1].link} className={HeaderStyles.cart}>
                <div className={HeaderStyles.cartImg}>
                    <img src={cart} alt="cart" />
                </div>
                <p className={HeaderStyles.priceAmount}>{`${priceAmount} р.`}</p>
            </NavLink>
        </div>

    </div>
}