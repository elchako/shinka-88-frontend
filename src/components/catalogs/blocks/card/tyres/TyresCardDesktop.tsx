import type React from "react"
import CardDesktopStyles from "../CardDesktopStyles.module.scss"
import { OffenButton } from "../../../../common/OffenButton"
import { useAppDispatch, useAppSelector, useTyresCardData, } from "../../../../../app/hooks"
import { amountHandler } from "../../../../../app/slices/filters/tiresFiltersSlice"
import type { resultsTyresType } from "../../../../../types/tires"
import { disksDataSelector, tyresDataSelector } from "../../../../../app/slices/cartSlice"

interface IProps {
    data: resultsTyresType
    handler: (data: resultsTyresType) => void
}


export const TyresCardDesktop: React.FC<IProps> = ({ data, handler }) => {
    const dispatch = useAppDispatch()
    const cardData = useTyresCardData(data)

    // поиск товаров, которые находятся в корзине
    const tyres = useAppSelector(tyresDataSelector)
    const disks = useAppSelector(disksDataSelector)
    const tiresData = tyres.map(item => {
        return { id: item.id, amount: item.amount }
    })
    const disksData = disks.map(item => {
        return { id: item.id, amount: item.amount }
    })
    const cartData = [...tiresData, ...disksData]
    let buttonTitle = 'КОРЗИНА'
    let buttonStyles = undefined

    for (let i = 0; i < cartData.length; i++) {
        if (cartData[i].id === data.id && cartData[i].amount === data.amount) {
            buttonTitle = 'В КОРЗИНЕ'
            buttonStyles = CardDesktopStyles.cartButton
            break
        }
    }

    return (
        <div className={CardDesktopStyles.mainWrapper}>
            <div className={CardDesktopStyles.icons}>
                <div className={CardDesktopStyles.iconsTop}>
                    {cardData.seasonIcon !== '' && <img src={cardData.seasonIcon} alt="" />}
                    {cardData.runflatIcon !== '' && <img src={cardData.runflatIcon} alt="" />}
                    {cardData.strongIcon && <img src={cardData.strongIcon} alt="" />}
                </div>
                <div className={CardDesktopStyles.iconsBottom}>
                    {/* <img src={gift} alt="" /> */}
                </div>
            </div>
            <div className={CardDesktopStyles.productImg}>
                <img src={data.image_url} alt="" />
            </div>
            <div className={CardDesktopStyles.productInfo}>
                <p className={CardDesktopStyles.productName}>{data.name}</p>
                <div className={CardDesktopStyles.productInfoContent}>
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
            <div className={CardDesktopStyles.productInfoAmount}>
                <div className={CardDesktopStyles.productInfoAmountItem}>
                    <p>Цена:</p>
                    <p>{data.price_sale}</p>
                </div>
                <div className={CardDesktopStyles.productInfoAmountItem}>
                    <p>Кол-во:</p>
                    <div>
                        <button onClick={() =>
                            dispatch(amountHandler({ id: data.id, isPlus: false }))}>&#9668;</button>
                        <p>{data.amount}</p>
                        <button onClick={() =>
                            dispatch(amountHandler({ id: data.id, isPlus: true }))}>&#9658;</button>
                    </div>
                </div>
                <div className={CardDesktopStyles.productInfoAmountItem}>
                    <p>Итого:</p>
                    <p>{data.price_sale * data.amount}</p>
                </div>
                <OffenButton handler={() => handler(data)} name={buttonTitle} styles={buttonStyles} />
            </div>
        </div>
    )
}