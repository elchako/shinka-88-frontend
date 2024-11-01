import type React from "react";
import HeaderStyles from "./HeaderStyles.module.scss";
import { NavLink } from "react-router-dom";
import phone from '../../imgs/phone.png';
import mobileCart from '../../imgs/cart/mobileCart.png'
import { Logo } from "../common/Logo";
import { useAppSelector } from "../../app/hooks";
import { disksDataSelector, tyresDataSelector } from "../../app/slices/cartSlice";
import { CartCounter } from "../common/CartCounter";


export const MobileHeader: React.FC = () => {
    const tyresAmount = useAppSelector(tyresDataSelector).length
    const disksAmount = useAppSelector(disksDataSelector).length

    const mobileLogoStyles = {
        logoImg: HeaderStyles.logoImgMobile,
        title: HeaderStyles.titleMobile,
        logo: HeaderStyles.logo
    }

    return <div className={HeaderStyles.mobileMainWrapper}>
        <a href="tel:+79197728888" className={HeaderStyles.mobilePhone}>
            <img src={phone} alt="phone" />
        </a>
        <Logo {...mobileLogoStyles} />
        <NavLink to='cart' className={HeaderStyles.mobileCart}>
            <CartCounter />
            <img src={mobileCart} alt="cart" />
        </NavLink>
    </div>
}