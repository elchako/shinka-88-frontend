import type React from "react"
import AutoPartsCardStyles from "./AutoPartsCardStyles.module.scss"
import tireExample from '../../../../../imgs/tiresCard/tire-example.png'
import cart from '../../../../../imgs/cart/basket.svg'
import { OffenButton } from "../../../../common/OffenButton"


export const AutoPartsCard: React.FC = () => {
    return (
        <div className={AutoPartsCardStyles.mainWrapper}>
            <div className={AutoPartsCardStyles.left}>
                <div className={AutoPartsCardStyles.productImg}>
                    <img src={tireExample} alt="" />
                </div>
                <div className={AutoPartsCardStyles.productInfo}>
                    <p className={AutoPartsCardStyles.productName}>НАИМЕНОВАНИЕ ЗАПЧАСТИ</p>
                    <div className={AutoPartsCardStyles.productInfoContent}>
                        Тут описание Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                        Officia, fugit inventore. Unde dicta cupiditate labore ea qui optio,
                        inventore nobis incidunt perspiciatis quis cumque rerum, iusto,
                        fugiat quaerat eligendi iste.
                    </div>
                    <div className={AutoPartsCardStyles.mobileInfoAmount}>
                        <div className={AutoPartsCardStyles.productInfoAmountItemMobile}>
                            <button>-</button>
                            <p>50</p>
                            <button>+</button>
                        </div>
                        <div className={AutoPartsCardStyles.productPriceMobile}>
                            15 000
                        </div>
                        <div className={AutoPartsCardStyles.productCartMobile}>
                            <img src={cart} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <div className={AutoPartsCardStyles.productInfoAmount}>
                <div className={AutoPartsCardStyles.productInfoAmountItem}>
                    <p>Цена:</p>
                    <p>3875</p>
                </div>
                <div className={AutoPartsCardStyles.productInfoAmountItem}>
                    <p>Количество:</p>
                    <div>
                        <button>&#9668;</button>
                        <p>50</p>
                        <button>&#9658;</button>
                    </div>
                </div>
                <div className={AutoPartsCardStyles.productInfoAmountItem}>
                    <p>Итого:</p>
                    <p>105 505</p>
                </div>
                <OffenButton name={'КОРЗИНА'} />
            </div>
        </div>
    )
}