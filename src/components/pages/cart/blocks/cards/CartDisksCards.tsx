import type React from "react"
import CartCardsStyles from "./CartCardsStyles.module.scss"
import CartStyles from '../../CartStyles.module.scss'
import delElement from '../../../../../imgs/cart/trash-bin.svg'
import Checkbox from "react-custom-checkbox";
import { useAppDispatch } from "../../../../../app/hooks"
import { changeAmount, delOneTypeProduct, selectProductHandler } from "../../../../../app/slices/cartSlice";
import { type selectedType } from "../../../../../types/cart";
import { type resultsDisksType } from "../../../../../types/disks";


interface IProps {
    data: selectedType & resultsDisksType
}

export const CartDisksCards: React.FC<IProps> = ({ data }) => {
    const dispatch = useAppDispatch()
    return (
        <div className={CartCardsStyles.mainWrapper}>
            <div className={CartCardsStyles.icons}>
                {<Checkbox
                    icon={<div className={CartStyles.icon}></div>}
                    className={CartStyles.checkboxCN}
                    labelClassName={CartStyles.checkboxLCN}
                    borderRadius={10}
                    borderColor={'#000'}
                    checked={!data.canceled}
                    onChange={() =>
                        dispatch(selectProductHandler({ productType: data.product_type, id: data.id }))}
                />}
            </div>
            <div className={CartCardsStyles.productImg}>
                <img src={data.image_url} alt="" />
            </div>
            <div className={CartCardsStyles.productInfo}>
                <p className={CartCardsStyles.productName}>{data.name}</p>
                <div className={CartCardsStyles.productInfoContent}>
                    <div>
                        <p>Диаметр: {data.diameter}</p>
                        <p>Диаметр PCD: {data.pcd}</p>
                        <p>Тип: {data.type_disk}</p>
                    </div>
                </div>
                <div className={CartCardsStyles.productButtons}>
                    <div className={CartCardsStyles.productInfoAmountItem}>
                        <button onClick={() => dispatch(changeAmount({
                            type: data.product_type,
                            id: data.id,
                            isPlus: false
                        }))}>-</button>
                        <p>{data.amount}</p>
                        <button onClick={() => dispatch(changeAmount({
                            type: data.product_type,
                            id: data.id,
                            isPlus: true
                        }))}>+</button>
                    </div>
                    <div className={CartCardsStyles.productPrice}>
                        {data.price_sale}
                    </div>
                </div>
            </div>
            <div className={CartCardsStyles.delElement}>
                <img onClick={() =>
                    dispatch(delOneTypeProduct({ productType: data.product_type, id: data.id }))}
                    src={delElement} alt="" width={28} height={28}  />
            </div>
        </div>
    )
}