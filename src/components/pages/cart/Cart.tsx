import type React from "react"
import CartStyles from "./CartStyles.module.scss"
import '../../../common.scss'
import { Footer } from "../../footer/Footer"
import Checkbox from "react-custom-checkbox";
import { CartTyresCards } from "./blocks/cards/CartTyresCards";
import { OrderInfo } from "../blocks/orderInfo/OrderInfo";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { links, tabs } from "../../../consts";
import { CartDisksCards } from "./blocks/cards/CartDisksCards";
import {
    disksDataSelector,
    priceAmountSelector,
    resetCart,
    selectAllHandler,
    selectAllSelector,
    tyresDataSelector
} from "../../../app/slices/cartSlice";
import { type resultsTyresType } from "../../../types/tires";
import { type resultsDisksType } from "../../../types/disks";
import { type selectedType } from "../../../types/cart";
import { useNavigate } from "react-router-dom";


type commonArray = Array<(selectedType & resultsTyresType) | (selectedType & resultsDisksType)>
type tiresData = selectedType & resultsTyresType
type disksData = selectedType & resultsDisksType

export const Cart: React.FC = () => {
    const dispatch = useAppDispatch()
    const selectAll = useAppSelector(selectAllSelector)
    const tyres = useAppSelector(tyresDataSelector)
    const disks = useAppSelector(disksDataSelector)

    // формирование массива всех товаров в корзине
    const cardData: commonArray = [...tyres, ...disks].sort((a, b) => a.queue - b.queue)

    // обработчик кнопки и общая цена для общей информации заказа
    const priceAmount = useAppSelector(priceAmountSelector)
    const navigate = useNavigate()
    const buttonHandler = () => {
        if (priceAmount === 0) {
            alert('Нет выбранных товаров')
        } else {
            navigate('/' + links[10].link)
        }
    }
    // регулировка ширины в зависимости от наполненности корзины
    let wrapperStyle = cardData.length === 0
        ? CartStyles.contentWrapper + ' ' + CartStyles.contentWrapperAnotherWidth
        : CartStyles.contentWrapper

    return (
        <div className={CartStyles.mainWrapper}>
            <div className={wrapperStyle}>
                <p className="pageTitle">Корзина</p>
                <div className={CartStyles.content}>
                    <div className={CartStyles.leftBlock}>

                        {/* управление всеми элементами корзины */}
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
                            />}
                            <p
                                onClick={() => dispatch(resetCart())}
                                className={CartStyles.clearCart}>Очистить корзину</p>
                        </div>

                        {/* карточки товаров */}
                        <div className={CartStyles.cards}>
                            {cardData.map((item, index) => {
                                // шины
                                if (item.product_type === tabs[0]) {
                                    return <CartTyresCards
                                        data={item as tiresData}
                                        key={`${item} - ${index}`} />
                                }
                                // диски
                                if (item.product_type === tabs[1]) {
                                    return <CartDisksCards
                                        data={item as disksData}
                                        key={`${item} - ${index}`} />
                                }
                                return null
                            })}
                        </div>
                    </div>

                    {/* кнопка оформления заказа */}
                    <OrderInfo nameButton='ОФОРМИТЬ ЗАКАЗ' name='В корзине'
                        handler={buttonHandler} />
                </div>
            </div>
            <Footer />
        </div>
    )
}