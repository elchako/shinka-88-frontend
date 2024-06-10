import type React from "react"
import CardMobileStyles from "./CardDesktopStyles.module.scss"
import gift from '../../../../imgs/tiresCard/gift.png'
import cart from '../../../../imgs/cart/productMobileCart.png'
import { useAppDispatch, useCardData } from "../../../../app/hooks"
import { amountHandler, type resultsType } from "../../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice"


interface IProps {
    data: resultsType
    handler: (data: resultsType) => void
}

export const CardMobile: React.FC<IProps> = ({ data, handler }) => {
    const dispatch = useAppDispatch()
    const cardData = useCardData(data)
    return (
        <div className={CardMobileStyles.mainWrapperMobile}>
            <div className={CardMobileStyles.productImgMobile}>
                <div className={CardMobileStyles.iconsMobile}>
                    <div className={CardMobileStyles.iconsTopMobile}>
                        {cardData.seasonIcon !== '' && <img src={cardData.seasonIcon} alt="" />}
                        {cardData.runflatIcon !== '' && <img src={cardData.runflatIcon} alt="" />}
                        {cardData.strongIcon && <img src={cardData.strongIcon} alt="" />}
                    </div>
                    <div className={CardMobileStyles.iconsBottomMobile}>
                        <img src={gift} alt="" />
                    </div>
                </div>
                <img src={data.image_url} alt="" />
            </div>
            <div className={CardMobileStyles.productInfoMobile}>
                <div className={CardMobileStyles.productInfoMobileTop}>
                    <p className={CardMobileStyles.productNameMobile}>{data.name}</p>
                    <div className={CardMobileStyles.productInfoContentMobile}>
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
                </div>
                <div className={CardMobileStyles.productInfoMobileBottom}>
                    <div className={CardMobileStyles.productInfoAmountItemMobile}>
                        <button onClick={() =>
                            dispatch(amountHandler({ id: data.id, isPlus: false }))}>-</button>
                        <p>{data.amount}</p>
                        <button onClick={() =>
                            dispatch(amountHandler({ id: data.id, isPlus: true }))}>+</button>
                    </div>
                    <div className={CardMobileStyles.productPriceMobile}>
                        {data.price_sale}
                    </div>
                    <div onClick={() => handler(data)} className={CardMobileStyles.productCartMobile}>
                        <img src={cart} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}