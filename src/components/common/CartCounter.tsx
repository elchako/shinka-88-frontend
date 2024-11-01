import type React from "react";
import styles from "./common.module.scss";
import { useAppSelector } from "../../app/hooks";
import { disksDataSelector, tyresDataSelector } from "../../app/slices/cartSlice";

export const CartCounter: React.FC = () => {
    const tyres = useAppSelector(tyresDataSelector)
    const disks = useAppSelector(disksDataSelector)
    const amount = tyres.length + disks.length

    const amountStyles = amount !== 0
        ? styles.cartAmount
        : styles.cartAmount + ' ' + styles.cartAmountHidden

    return (
        <div className={amountStyles}>
            <p>{amount}</p>
        </div>
    )
}