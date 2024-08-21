import type React from "react"
import OrderInfoStyles from "./OrderInfoStyles.module.scss"
import '../../../../common.scss'
import { OffenButton } from "../../../common/OffenButton"
import { useAppSelector } from "../../../../app/hooks"
import { links } from "../../../../consts"
import { useNavigate } from "react-router-dom"
import {
    disksDataSelector,
    priceAmountSelector,
    tyresDataSelector
} from "../../../../app/slices/cartSlice"

interface IProps {
    name: string
    nameButton: string
    handler: () => void
}

export const OrderInfo: React.FC<IProps> = ({ nameButton, name, handler }) => {
    const tyres = useAppSelector(tyresDataSelector)
    const disks = useAppSelector(disksDataSelector)
    const products = [...tyres, ...disks].sort((a, b) => a.queue - b.queue)
    const productsData: Array<{ type: string, amount: number, price: number }> = []
    const priceAmount = useAppSelector(priceAmountSelector)

    products.forEach(item => {
        if (item.canceled) return
        let isThere = false
        productsData.forEach(el => {
            if (el.type === item.product_type) {
                el.amount += item.amount
                el.price += item.amount * item.price_sale
                isThere = true
            }
        })
        if (!isThere) productsData.push({
            type: item.product_type,
            amount: item.amount,
            price: item.price_sale * item.amount
        })
    })

    return (
        <div className={OrderInfoStyles.mainWrapper}>
            <p className={OrderInfoStyles.title}>{name}</p>
            <div className={OrderInfoStyles.info}>
                {productsData.map((item, index) => {
                    return <div className={OrderInfoStyles.infoItem} key={`${item} - ${index}`}>
                        <p className={OrderInfoStyles.infoTitle}>{`${item.type}, ${item.amount}шт.`}</p>
                        <p className={OrderInfoStyles.infoPrice}>{item.price}</p>
                    </div>
                })}
            </div>
            <p className={OrderInfoStyles.price}>{`Итого ${priceAmount} р`}</p>
            <OffenButton name={nameButton} handler={handler} />
        </div>
    )
}