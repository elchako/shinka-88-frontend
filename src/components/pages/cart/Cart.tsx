import type React from "react"
import CartStyles from "./CartStyles.module.scss"
import '../../../common.scss'
import { Footer } from "../../footer/Footer"
import Checkbox from "react-custom-checkbox";
import { CartCards } from "./blocks/cards/CartCards";
import { OrderInfo } from "../blocks/orderInfo/OrderInfo";

export const Cart: React.FC = () => {
    return (
        <>
            <div className={CartStyles.mainWrapper}>
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
                                checked={true}
                            // onChange={() => dispatch(checkboxesSelect(checkboxesNames[0]))}
                            />}
                            <p className={CartStyles.clearCart}>Очистить корзину</p>
                        </div>
                        <div className={CartStyles.cards}>
                            {[...Array(4)].map(item => {
                                return <CartCards />
                            })}
                        </div>
                    </div>
                    <OrderInfo nameButton='ОФОРМИТЬ ЗАКАЗ' name='В корзине' />
                </div>
            </div>
            <Footer />
        </>
    )
}