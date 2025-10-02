import type React from "react"
import { useAppDispatch, useSelectedProduct, useTyresCardData } from "../../../../../app/hooks"
import { amountHandler } from "../../../../../app/slices/filters/tiresFiltersSlice"
import minus from '../../../../../imgs/minus.svg'
import plus from '../../../../../imgs/plus.svg'
import type { resultsTyresType } from "../../../../../types/tires"
import { OffenButton } from "../../../../common/OffenButton"
import CardMobileStyles from "../CardDesktopStyles.module.scss"


interface IProps {
    data: resultsTyresType
    handler: (data: resultsTyresType, inCart: boolean) => void
}

export const TyresCardMobile: React.FC<IProps> = ({ data, handler }) => {
    const dispatch = useAppDispatch()
    const cardData = useTyresCardData(data)

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
                    <div className={CardMobileStyles.iconsMobile}>
                        <div className={CardMobileStyles.iconsTopMobile}>
                            {cardData.seasonIcon !== '' && <img src={cardData.seasonIcon} alt="" />}
                            {cardData.runflatIcon !== '' && <img src={cardData.runflatIcon} alt="" />}
                            {cardData.strongIcon && <img src={cardData.strongIcon} alt="" />}
                        </div>
                        {/* <div className={CardMobileStyles.iconsBottomMobile}>
                            <img src={gift} alt="" />
                        </div> */}
                    </div>
                    <img src={data.image_url} alt="" />
                </div>
                <div className={CardMobileStyles.productInfoMobile}>
                    <div className={CardMobileStyles.productInfoMobileTop}>
                        <p className={CardMobileStyles.productNameMobile}>{data.name}</p>
                        <div className={CardMobileStyles.productInfoContentMobile}>
                            <div>
                                <p>Размер: {`${data.width}/${data.height}`}</p>
                                <p>Сезон: {data.seazon}</p>
                                <p>Марка: {data.marka}</p>
                            </div>
                            <div>
                                <p>{cardData.runflatText}</p>
                                <p>{cardData.strongText}</p>
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
                                plusHandler()}><img src={plus} alt="" width={24} height={24}/></button>
                        </div>
                    </div>
                    <OffenButton handler={() => handler(data, cartButtonData.buttonStyles)} name={buttonTitle}
                        styles={buttonStyles} />
                </div>
            </div>
        </div>
    )
}