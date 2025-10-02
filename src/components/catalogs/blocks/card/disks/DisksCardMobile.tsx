import type React from "react"
import { useAppDispatch, useSelectedProduct } from "../../../../../app/hooks"
import { amountHandler } from "../../../../../app/slices/filters/disksFiltersSlice"
import type { resultsDisksType } from "../../../../../types/disks"
import { OffenButton } from "../../../../common/OffenButton"
import CardMobileStyles from "../CardDesktopStyles.module.scss"
import minus from '../../../../../imgs/minus.svg'
import plus from '../../../../../imgs/plus.svg'

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

    const minusButtonStyle = data.amount !== 1
        ? CardMobileStyles.activeButton
        : CardMobileStyles.deactiveButton

    const plusButtonStyle = data.amount !== data.balance
        ? CardMobileStyles.activeButton
        : CardMobileStyles.deactiveButton

    return (
        <div className={CardMobileStyles.mainWrapperMobile}>
            <div className={CardMobileStyles.topBlock}>
                <div className={CardMobileStyles.productImgMobile}>
                    <img src={data.image_url} alt="" />
                </div>
                <div className={CardMobileStyles.productInfoMobile}>
                    <div className={CardMobileStyles.productInfoMobileTop}>
                        <p className={CardMobileStyles.productNameMobile}>{data.name}</p>
                        <div className={CardMobileStyles.productInfoContentMobile}>
                            <div>
                                <p>Диаметр: {data.diameter}</p>
                                <p>Диаметр PCD: {data.pcd}</p>
                                <p>Тип: {data.type_disk}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <div className={CardMobileStyles.bottomBlock}>
                    <div className={CardMobileStyles.productInfoMobileBottom}>
                        <div className={CardMobileStyles.productPriceMobile}>
                            {data.price_sale}р.
                        </div>
                        <div className={CardMobileStyles.priceAmount}>
                            <div className={CardMobileStyles.productInfoAmountItemMobile}>
                                <button className={minusButtonStyle} onClick={() =>
                                    dispatch(amountHandler({ id: data.id, isPlus: false }))}><img src={minus} alt="" width={24} height={24} /></button>
                                <p>{data.amount}</p>
                                <button className={plusButtonStyle} onClick={() =>
                                    plusHandler()}><img src={plus} alt="" width={24} height={24} /></button>
                            </div>
                        </div>
                        <OffenButton handler={() => handler(data, cartButtonData.buttonStyles)} name={buttonTitle}
                            styles={buttonStyles} />
                    </div>
                </div>
            </div>
    )
}