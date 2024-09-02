import type React from "react"
import CardDesktopStyles from "../CardDesktopStyles.module.scss"
import { OffenButton } from "../../../../common/OffenButton"
import { useAppDispatch, } from "../../../../../app/hooks"
import { amountHandler } from "../../../../../app/slices/filters/disksFiltersSlice"
import type { resultsDisksType } from "../../../../../types/disks"


interface IProps {
    data: resultsDisksType
    handler: (data: resultsDisksType) => void
}


export const DisksCardDesktop: React.FC<IProps> = ({ data, handler }) => {
    const dispatch = useAppDispatch()

    return (
        <div className={CardDesktopStyles.mainWrapper}>
            <div className={CardDesktopStyles.productImg}>
                <img src={data.image_url} alt="" />
            </div>
            <div className={CardDesktopStyles.productInfo}>
                <p className={CardDesktopStyles.productName}>{data.name}</p>
                <div className={CardDesktopStyles.productInfoContent}>
                    <div>
                        <p>{data.diameter}</p>
                        <p>{data.pcd}</p>
                        <p>{data.type_disk}</p>
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
                            dispatch(amountHandler({ id: data.id, isPlus: true }))}>&#9658;</button>
                    </div>
                </div>
                <div className={CardDesktopStyles.productInfoAmountItem}>
                    <p>Итого:</p>
                    <p>{data.price_sale * data.amount}</p>
                </div>
                <OffenButton handler={() => handler(data)} name={'КОРЗИНА'} />
            </div>
        </div>
    )
}