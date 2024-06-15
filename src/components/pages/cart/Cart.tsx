import type React from "react"
import CartStyles from "./CartStyles.module.scss"
import '../../../common.scss'
import { Footer } from "../../footer/Footer"
import Checkbox from "react-custom-checkbox";
import { CartTyresCards } from "./blocks/cards/CartTyresCards";
import { OrderInfo } from "../blocks/orderInfo/OrderInfo";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { resetCart, selectAllHandler, selectAllSelector, tyresDataSelector } from "./cartSlice";

export const Cart: React.FC = () => {
    const dispatch = useAppDispatch()
    const tyres = useAppSelector(tyresDataSelector)
    const cardData = [...tyres].sort((a, b) => a.queue - b.queue)
    const selectAll = useAppSelector(selectAllSelector)
    let wrapperStyle = cardData.length === 0
        ? CartStyles.contentWrapper + ' ' + CartStyles.contentWrapperAnotherWidth
        : CartStyles.contentWrapper
    return (
        <div className={CartStyles.mainWrapper}>
            <div className={wrapperStyle}>
                <p className="pageTitle">Корзина</p>
                <div className={CartStyles.content}>
                    <div className={CartStyles.leftBlock}>
                        <div className={CartStyles.actionForAll}>
                            {<Checkbox
                                icon={<div className={CartStyles.icon}></div>}
                                label={'Выбрать все'}
                                className={CartStyles.checkboxCN}
                                labelClassName={CartStyles.checkboxLCN}
                                borderRadius={10}
                                borderColor={'#000'}
                                checked={selectAll}
                                onChange={() => dispatch(selectAllHandler())}
                            // onChange={() => dispatch(checkboxesSelect(checkboxesNames[0]))}
                            />}
                            <p onClick={() => dispatch(resetCart())} className={CartStyles.clearCart}>Очистить корзину</p>
                        </div>
                        <div className={CartStyles.cards}>
                            {cardData.map((item, index) => {
                                return <CartTyresCards data={item} key={`${item} - ${index}`} />
                            })}
                        </div>
                    </div>
                    <OrderInfo nameButton='ОФОРМИТЬ ЗАКАЗ' name='В корзине' />
                </div>
            </div>
            <Footer />
        </div>
    )
}