import type React from "react"
import TiresCardDesktopStyles from "./TiresCardDesktopStyles.module.scss"
import summer from '../../../../../imgs/tiresCard/summer.png'
import runflat from '../../../../../imgs/tiresCard/runflat.png'
import strong from '../../../../../imgs/tiresCard/strong.png'
import gift from '../../../../../imgs/tiresCard/gift.png'
import tireExample from '../../../../../imgs/tiresCard/tire-example.png'
import { OffenButton } from "../../../../common/OffenButton"


export const TiresCardDesktop: React.FC = () => {
    return (
        <div className={TiresCardDesktopStyles.mainWrapper}>
            <div className={TiresCardDesktopStyles.icons}>
                <div className={TiresCardDesktopStyles.iconsTop}>
                    <img src={summer} alt="" />
                    <img src={runflat} alt="" />
                    <img src={strong} alt="" />
                </div>
                <div className={TiresCardDesktopStyles.iconsBottom}>
                    <img src={gift} alt="" />
                </div>
            </div>
            <div className={TiresCardDesktopStyles.productImg}>
                <img src={tireExample} alt="" />
            </div>
            <div className={TiresCardDesktopStyles.productInfo}>
                <p className={TiresCardDesktopStyles.productName}>Наименование модели</p>
                <div className={TiresCardDesktopStyles.productInfoContent}>
                    <div>
                        <p>205/55</p>
                        <p>Лето</p>
                        <p>Производитель</p>
                    </div>
                    <div>
                        <p>RunFlat</p>
                    </div>
                </div>
            </div>
            <div className={TiresCardDesktopStyles.productInfoAmount}>
                <div className={TiresCardDesktopStyles.productInfoAmountItem}>
                    <p>Цена:</p>
                    <p>3875</p>
                </div>
                <div className={TiresCardDesktopStyles.productInfoAmountItem}>
                    <p>Количество:</p>
                    <div>
                        <button>&#9668;</button>
                        <p>50</p>
                        <button>&#9658;</button>
                    </div>
                </div>
                <div className={TiresCardDesktopStyles.productInfoAmountItem}>
                    <p>Итого:</p>
                    <p>105 505</p>
                </div>
                <OffenButton name={'КОРЗИНА'} />
            </div>
        </div>
    )
}