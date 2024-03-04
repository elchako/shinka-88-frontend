import type React from "react"
import TiresCardMobileStyles from "./TiresCardDesktopStyles.module.scss"
import summer from '../../../../../imgs/tiresCard/summer.png'
import runflat from '../../../../../imgs/tiresCard/runflat.png'
import strong from '../../../../../imgs/tiresCard/strong.png'
import gift from '../../../../../imgs/tiresCard/gift.png'
import tireExample from '../../../../../imgs/tiresCard/tire-example.png'
import cart from '../../../../../imgs/cart/productMobileCart.png'
import inCart from '../../../../../imgs/cart/productInCart.png'


export const TiresCardMobile: React.FC = () => {
    return (
        <div className={TiresCardMobileStyles.mainWrapperMobile}>
            <div className={TiresCardMobileStyles.productImgMobile}>
                <div className={TiresCardMobileStyles.iconsMobile}>
                    <div className={TiresCardMobileStyles.iconsTopMobile}>
                        <img src={summer} alt="" />
                        <img src={runflat} alt="" />
                        <img src={strong} alt="" />
                    </div>
                    <div className={TiresCardMobileStyles.iconsBottomMobile}>
                        <img src={gift} alt="" />
                    </div>
                </div>
                <img src={tireExample} alt="" />
            </div>
            <div className={TiresCardMobileStyles.productInfoMobile}>
                <div className={TiresCardMobileStyles.productInfoMobileTop}>
                    <p className={TiresCardMobileStyles.productNameMobile}>Наименование модели</p>
                    <div className={TiresCardMobileStyles.productInfoContentMobile}>
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
                <div className={TiresCardMobileStyles.productInfoMobileBottom}>
                    <div className={TiresCardMobileStyles.productInfoAmountItemMobile}>
                        <button>-</button>
                        <p>50</p>
                        <button>+</button>
                    </div>
                    <div className={TiresCardMobileStyles.productPriceMobile}>
                        15 000
                    </div>
                    <div className={TiresCardMobileStyles.productCartMobile}>
                        <img src={cart} alt="" />
                    </div>
                </div>
            </div>
            {/* <div className={TiresCardMobileStyles.productInfoAmount}>
                <div className={TiresCardMobileStyles.productInfoAmountItem}>
                    <p>Цена:</p>
                    <p>3875</p>
                </div>
                <div className={TiresCardMobileStyles.productInfoAmountItem}>
                    <p>Количество:</p>
                    <div>
                        <button>&#9668;</button>
                        <p>50</p>
                        <button>&#9658;</button>
                    </div>
                </div>
                <div className={TiresCardMobileStyles.productInfoAmountItem}>
                    <p>Итого:</p>
                    <p>105 505</p>
                </div>
                <OffenButton />
            </div> */}
        </div>
    )
}