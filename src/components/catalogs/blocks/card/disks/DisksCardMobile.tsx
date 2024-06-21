import type React from "react"
import CardMobileStyles from "../CardDesktopStyles.module.scss"
import cart from '../../../../../imgs/cart/productMobileCart.png'
import { useAppDispatch } from "../../../../../app/hooks"
import { amountHandler, type resultsDisksType } from "../../../../pages/main/blocks/filters/filtersBlocks/filterBlock2Slice"


interface IProps {
    data: resultsDisksType
    handler: (data: resultsDisksType) => void
}

export const DisksCardMobile: React.FC<IProps> = ({ data, handler }) => {
    const dispatch = useAppDispatch()
    return (
        <div className={CardMobileStyles.mainWrapperMobile}>
            <div className={CardMobileStyles.productImgMobile}>

                <img src={data.image_url} alt="" />
            </div>
            <div className={CardMobileStyles.productInfoMobile}>
                <div className={CardMobileStyles.productInfoMobileTop}>
                    <p className={CardMobileStyles.productNameMobile}>{data.name}</p>
                    <div className={CardMobileStyles.productInfoContentMobile}>
                        <div>
                            <p>{data.diameter}</p>
                            <p>{data.pcd}</p>
                            <p>{data.type_disk}</p>
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