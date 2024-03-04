import type React from "react"
import CartCardsStyles from "./CartCardsStyles.module.scss"
import CartStyles from '../../CartStyles.module.scss'
import summer from '../../../../../imgs/tiresCard/summer.png'
import runflat from '../../../../../imgs/tiresCard/runflat.png'
import strong from '../../../../../imgs/tiresCard/strong.png'
import gift from '../../../../../imgs/tiresCard/gift.png'
import tireExample from '../../../../../imgs/tiresCard/tire-example.png'
import delElement from '../../../../../imgs/cart/del_from_cart.png'
import Checkbox from "react-custom-checkbox";


export const CartCards: React.FC = () => {


    return (
        <div className={CartCardsStyles.mainWrapper}>
            <div className={CartCardsStyles.icons}>
                {<Checkbox
                    icon={<div className={CartStyles.icon}></div>}
                    className={CartStyles.checkboxCN}
                    labelClassName={CartStyles.checkboxLCN}
                    borderRadius={10}
                    borderColor={'#000'}
                    checked={true}
                // onChange={() => dispatch(checkboxesSelect(checkboxesNames[0]))}
                />}
                <div className={CartCardsStyles.iconsContent}>
                    <div className={CartCardsStyles.iconsTop}>
                        <img src={summer} alt="" />
                        <img src={runflat} alt="" />
                        <img src={strong} alt="" />
                    </div>
                    <div className={CartCardsStyles.iconsBottom}>
                        <img src={gift} alt="" />
                    </div>
                </div>
            </div>
            <div className={CartCardsStyles.productImg}>
                <img src={tireExample} alt="" />
            </div>
            <div className={CartCardsStyles.productInfo}>
                <p className={CartCardsStyles.productName}>Наименование модели</p>
                <div className={CartCardsStyles.productInfoContent}>
                    <div>
                        <p>205/55</p>
                        <p>Лето</p>
                        <p>Производитель</p>
                    </div>
                    <div>
                        <p>RunFlat</p>
                    </div>
                </div>
                <div className={CartCardsStyles.productButtons}>
                    <div className={CartCardsStyles.productInfoAmountItem}>
                        <button>-</button>
                        <p>50</p>
                        <button>+</button>
                    </div>
                    <div className={CartCardsStyles.productPrice}>
                        15 000
                    </div>
                </div>
            </div>
            <div className={CartCardsStyles.delElement}>
                <img src={delElement} alt="" />
            </div>
        </div>
    )
}