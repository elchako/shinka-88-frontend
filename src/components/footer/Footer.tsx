import type React from "react"
import FooterStyles from "./FooterStyles.module.scss"
import { Logo } from "../common/Logo"
import { NavLink } from "react-router-dom"
import { links } from "../../consts"


export const Footer: React.FC = () => {
    const logoStyles = {
        logoImg: FooterStyles.logoImg,
        title: FooterStyles.title,
        logo: FooterStyles.logo,
    }
    return (
        <div className={FooterStyles.mainWrapper}>
            <div className={FooterStyles.content}>
                <div className={FooterStyles.contentInfo}>
                    <Logo {...logoStyles} />
                    <div className={FooterStyles.line}></div>
                    <div className={FooterStyles.infoLinks}>
                        <div className={FooterStyles.infoLinksContent}>
                            <div className={FooterStyles.links}>
                                <NavLink to={'../' + links[12].link}>О нас</NavLink>
                                <NavLink to={'../' + links[13].link}>Гарантии</NavLink>
                                <NavLink to={'../' + links[3].link}>Каталог</NavLink>
                                <NavLink to={'../' + links[11].link}>Оплата</NavLink>
                            </div>
                            <p className={FooterStyles.coop}>©2024 Наименование организации. Все права защищены.</p>
                        </div>
                    </div>
                </div>
                <p className={FooterStyles.coopMobile}>©2024 Наименование организации. Все права защищены.</p>
            </div>
        </div>
    )
}