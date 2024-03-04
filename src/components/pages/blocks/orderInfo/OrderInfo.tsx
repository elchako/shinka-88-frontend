import type React from "react"
import OrderInfoStyles from "./OrderInfoStyles.module.scss"
import '../../../../common.scss'
import { OffenButton } from "../../../common/OffenButton"

interface IProps {
    name: string
    nameButton: string
}

export const OrderInfo: React.FC<IProps> = ({ nameButton, name }) => {
    return (
        <div className={OrderInfoStyles.mainWrapper}>
            <p className={OrderInfoStyles.title}>{name}</p>
            <div className={OrderInfoStyles.info}>
                <div className={OrderInfoStyles.infoItem}>
                    <p className={OrderInfoStyles.infoTitle}>Шины, 4шт.</p>
                    <p className={OrderInfoStyles.infoPrice}>15 000</p>
                </div>
                <div className={OrderInfoStyles.infoItem}>
                    <p className={OrderInfoStyles.infoTitle}>Диски, 2шт.</p>
                    <p className={OrderInfoStyles.infoPrice}>10 500</p>
                </div>
                <div className={OrderInfoStyles.infoItem}>
                    <p className={OrderInfoStyles.infoTitle}>Шиномонтаж</p>
                    <p className={OrderInfoStyles.infoPrice}>Бесплатно</p>
                </div>
            </div>
            <p className={OrderInfoStyles.price}>Итого 26 000 р</p>
            <OffenButton name={nameButton} />
        </div>
    )
}