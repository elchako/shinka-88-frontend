import type React from "react"
import CardDesktopStyles from "../CardDesktopStyles.module.scss"
import { OffenButton } from "../../../../common/OffenButton"
import { useAppDispatch, useSelectedProduct, } from "../../../../../app/hooks"
import { amountHandler } from "../../../../../app/slices/filters/disksFiltersSlice"
import type { resultsDisksType } from "../../../../../types/disks"


interface IProps {
    data: resultsDisksType
    handler: (data: resultsDisksType, inCart: boolean) => void
}


export const DisksCardDesktop: React.FC<IProps> = ({ data, handler }) => {
    const dispatch = useAppDispatch()

    // поиск товаров, которые находятся в корзине
    const cartButtonData = useSelectedProduct(data)
    let buttonTitle = cartButtonData.buttonTitle
    let buttonStyles = cartButtonData.buttonStyles
        ? CardDesktopStyles.cartButton
        : undefined

    const plusHandler = () => {
        if (data.amount === data.balance) {
            alert(`Количество товара на складе ${data.balance}шт, невозможно добавить товар`)
            return
        }
        dispatch(amountHandler({ id: data.id, isPlus: true }))
    }

    return (
        <div className={CardDesktopStyles.mainWrapper}>
            <div className={CardDesktopStyles.productImg}>
                <img src={data.image_url} alt="" />
            </div>
            <div className={CardDesktopStyles.productInfo}>
                <p className={CardDesktopStyles.productName}>{data.name}</p>
                <div className={CardDesktopStyles.productInfoContent}>
                    <div>
                        <p>Диаметр: {data.diameter}</p>
                        <p>Диаметр PCD: {data.pcd}</p>
                        <p>Тип: {data.type_disk}</p>
                    </div>
                </div>
            </div>
            <div className={CardDesktopStyles.productInfoAmount}>
                <div className={CardDesktopStyles.productInfoAmountItem}>
                    <p>Цена:</p>
                    <p>{data.price_sale}</p>
                </div>
                <div className={CardDesktopStyles.productInfoAmountItem}>
                    <p>Количество:</p>
                    <div>
                        <button onClick={() =>
                            dispatch(amountHandler({ id: data.id, isPlus: false }))}>&#9668;</button>
                        <p>{data.amount}</p>
                        <button onClick={() =>
                            plusHandler()}>&#9658;</button>
                    </div>
                </div>
                <div className={CardDesktopStyles.productInfoAmountItem}>
                    <p>Итого:</p>
                    <p>{data.price_sale * data.amount}</p>
                </div>
                <OffenButton handler={() => handler(data, cartButtonData.buttonStyles)} name={buttonTitle}
                    styles={buttonStyles} />
            </div>
        </div>
    )
}