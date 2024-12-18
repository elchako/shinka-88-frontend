import type React from "react"
import { useAppDispatch, useSelectedProduct } from "../../../../../app/hooks"
import { amountHandler } from "../../../../../app/slices/filters/disksFiltersSlice"
import type { resultsDisksType } from "../../../../../types/disks"
import { OffenButton } from "../../../../common/OffenButton"
import CardMobileStyles from "../CardDesktopStyles.module.scss"


interface IProps {
    data: resultsDisksType
    handler: (data: resultsDisksType, inCart: boolean) => void
}

export const DisksCardMobile: React.FC<IProps> = ({ data, handler }) => {
    const dispatch = useAppDispatch()

    const plusHandler = () => {
        if (data.amount === data.balance) {
            alert(`Количество товара на складе ${data.balance}шт, невозможно добавить товар`)
            return
        }
        dispatch(amountHandler({ id: data.id, isPlus: true }))
    }

    // поиск товаров, которые находятся в корзине
    const cartButtonData = useSelectedProduct(data)
    let buttonTitle = cartButtonData.buttonTitle
    let buttonStyles = cartButtonData.buttonStyles
        ? CardMobileStyles.cartButton
        : undefined
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
                            plusHandler()}>+</button>
                    </div>
                    <div className={CardMobileStyles.productPriceMobile}>
                        {data.price_sale}
                    </div>
                    <OffenButton handler={() => handler(data, cartButtonData.buttonStyles)} name={buttonTitle}
                        styles={buttonStyles} />
                </div>
            </div>
        </div>
    )
}