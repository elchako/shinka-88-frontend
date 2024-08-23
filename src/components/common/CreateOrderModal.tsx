import type React from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { creatingOrderSelector, orderIsCreating, orderNumberSelector } from "../../app/slices/cartSlice";
import Styles from './common.module.scss'

export const CreateOrder: React.FC = () => {
    const dispatch = useAppDispatch()
    const creatingOrder = useAppSelector(creatingOrderSelector)
    const orderNumber = useAppSelector(orderNumberSelector)

    let openStyle
    if (creatingOrder) {
        openStyle = Styles.placingOrderWrapper
    } else {
        openStyle = Styles.placingOrderWrapper + ' ' + Styles.placingOrderWrapperHidden
    }

    return <div className={openStyle}>
        <div className={Styles.placingOrder}>
            {orderNumber !== 0
                ? <div className={Styles.placingOrderContent}>
                    <p>Номер Вашего заказа: {orderNumber}</p>
                    <p>Ожидайте. Скоро с Вами свяжется наш менеджер.</p>
                    <NavLink to='/'>
                        <button className={Styles.placingOrderButton}
                            onClick={() => dispatch(orderIsCreating())}>Закрыть</button>
                    </NavLink>
                </div>
                : <div className={Styles.loader}>
                    <div className={Styles.wheel}>
                        <div className={Styles.tire}></div>
                        <div className={Styles.rim}></div>
                    </div>
                </div>}

        </div>
    </div>
}