import type React from "react"
import CardMobileStyles from "./CardDesktopStyles.module.scss"
import summer from '../../../../imgs/tiresCard/summer.png'
import runflat from '../../../../imgs/tiresCard/runflat.png'
import strong from '../../../../imgs/tiresCard/strong.png'
import gift from '../../../../imgs/tiresCard/gift.png'
import tireExample from '../../../../imgs/tiresCard/tire-example.png'
import cart from '../../../../imgs/cart/productMobileCart.png'
import inCart from '../../../../imgs/cart/productInCart.png'


export const CardMobile: React.FC = () => {
    return (
        <div className={CardMobileStyles.mainWrapperMobile}>
            <div className={CardMobileStyles.productImgMobile}>
                <div className={CardMobileStyles.iconsMobile}>
                    <div className={CardMobileStyles.iconsTopMobile}>
                        <img src={summer} alt="" />
                        <img src={runflat} alt="" />
                        <img src={strong} alt="" />
                    </div>
                    <div className={CardMobileStyles.iconsBottomMobile}>
                        <img src={gift} alt="" />
                    </div>
                </div>
                <img src={tireExample} alt="" />
            </div>
            <div className={CardMobileStyles.productInfoMobile}>
                <div className={CardMobileStyles.productInfoMobileTop}>
                    <p className={CardMobileStyles.productNameMobile}>Наименование модели</p>
                    <div className={CardMobileStyles.productInfoContentMobile}>
                        <div>
                            <p>205/55</p>
                            <p>Лето</p>
                            <p>Производитель</p>
                        </div>
                        <div>
                            <p>RunFlat</p>
                            <p>Усиленные</p>
                        </div>
                    </div>
                </div>
                <div className={CardMobileStyles.productInfoMobileBottom}>
                    <div className={CardMobileStyles.productInfoAmountItemMobile}>
                        <button>-</button>
                        <p>50</p>
                        <button>+</button>
                    </div>
                    <div className={CardMobileStyles.productPriceMobile}>
                        15 000
                    </div>
                    <div className={CardMobileStyles.productCartMobile}>
                        <img src={cart} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}