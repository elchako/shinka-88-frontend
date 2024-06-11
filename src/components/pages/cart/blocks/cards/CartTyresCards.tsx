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
import type { resultsType } from "../../../main/blocks/filters/filtersBlocks/filterBlock1Slice"
import { useAppDispatch, useCardData } from "../../../../../app/hooks"
import { changeAmount, delOneTypeProduct, selectProductHandler, type selectedTyresType } from "../../cartSlice"

interface IProps {
    data: selectedTyresType & resultsType
}

export const CartTyresCards: React.FC<IProps> = ({ data }) => {
    const cardData = useCardData(data)
    const dispatch = useAppDispatch()
    return (
        <div className={CartCardsStyles.mainWrapper}>
            <div className={CartCardsStyles.icons}>
                {<Checkbox
                    icon={<div className={CartStyles.icon}></div>}
                    className={CartStyles.checkboxCN}
                    labelClassName={CartStyles.checkboxLCN}
                    borderRadius={10}
                    borderColor={'#000'}
                    checked={!data.canceled}
                    onChange={() =>
                        dispatch(selectProductHandler({ productType: data.product_type, id: data.id }))}
                />}
                <div className={CartCardsStyles.iconsContent}>
                    <div className={CartCardsStyles.iconsTop}>
                        {cardData.seasonIcon !== '' && <img src={cardData.seasonIcon} alt="" />}
                        {cardData.runflatIcon !== '' && <img src={cardData.runflatIcon} alt="" />}
                        {cardData.strongIcon && <img src={cardData.strongIcon} alt="" />}
                    </div>
                    <div className={CartCardsStyles.iconsBottom}>
                        <img src={gift} alt="" />
                    </div>
                </div>
            </div>
            <div className={CartCardsStyles.productImg}>
                <img src={data.image_url} alt="" />
            </div>
            <div className={CartCardsStyles.productInfo}>
                <p className={CartCardsStyles.productName}>{data.name}</p>
                <div className={CartCardsStyles.productInfoContent}>
                    <div>
                        <p>{`${data.width}/${data.height}`}</p>
                        <p>{data.seazon}</p>
                        <p>{data.marka}</p>
                    </div>
                    <div>
                        <p>{cardData.runflatText}</p>
                        <p>{cardData.strongText}</p>
                    </div>
                </div>
                <div className={CartCardsStyles.productButtons}>
                    <div className={CartCardsStyles.productInfoAmountItem}>
                        <button onClick={() => dispatch(changeAmount({
                            type: data.product_type,
                            id: data.id,
                            isPlus: false
                        }))}>-</button>
                        <p>{data.amount}</p>
                        <button onClick={() => dispatch(changeAmount({
                            type: data.product_type,
                            id: data.id,
                            isPlus: true
                        }))}>+</button>
                    </div>
                    <div className={CartCardsStyles.productPrice}>
                        {data.price_sale}
                    </div>
                </div>
            </div>
            <div className={CartCardsStyles.delElement}>
                <img onClick={() =>
                    dispatch(delOneTypeProduct({ productType: data.product_type, id: data.id }))}
                    src={delElement} alt="" />
            </div>
        </div>
    )
}