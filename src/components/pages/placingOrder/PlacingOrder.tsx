import type React from "react"
import PlacingOrderStyles from "./PlacingOrderStyles.module.scss"
import '../../../common.scss'
import { Footer } from "../../footer/Footer"
import { OrderInfo } from "../blocks/orderInfo/OrderInfo";
import { useEffect } from "react";
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { nameSelector, phoneSelector, setName, setPhone, toogleModal } from "../../../app/slices/authSlice";
import { createOrder, disksDataSelector, priceAmountSelector, tyresDataSelector } from "../../../app/slices/cartSlice";
import type { orderProductsType, orderType } from "../../../types/cart";
import { Helmet } from "react-helmet-async";


export const PlacingOrder: React.FC = () => {
    const dispatch = useAppDispatch()
    const name = useAppSelector(nameSelector)
    const phone = useAppSelector(phoneSelector)
    const tyres = useAppSelector(tyresDataSelector)
    const disks = useAppSelector(disksDataSelector)
    const total_amount = useAppSelector(priceAmountSelector)
    const order_items: orderProductsType = {}
    const order: orderType = {
        total_amount: total_amount,
        order_items: order_items
    }

    if (tyres.length !== 0) {
        order_items.tyres = []
        for (let i = 0; i < tyres.length; i++) {
            order_items.tyres.push({
                id: tyres[i].id,
                quantity: tyres[i].amount,
                price: tyres[i].price_sale
            })
        }
    }

    if (disks.length !== 0) {
        order_items.disks = []
        for (let i = 0; i < disks.length; i++) {
            order_items.disks.push({
                id: disks[i].id,
                quantity: disks[i].amount,
                price: disks[i].price_sale
            })
        }
    }

    const buttonHandler = (): void => {
        const phoneRegex = /^7\d{10}$/;
        if (name === '' || phone === '') {
            alert('Заполните все поля')
            return
        } else if (!phone.match(phoneRegex)) {
            alert('Неверный номер телефона')
            return
        } else {
            const token = Cookies.get('token')
            if (!token) {
                dispatch(toogleModal())
            } else {
                localStorage.setItem('customerLocalData', JSON.stringify({ name, phone }))
                dispatch(createOrder({ order, token }))
            }
        }
    }

    useEffect(() => {
        const token = Cookies.get('token')
        const customerLocalData: string | null = localStorage.getItem('customerLocalData')
        if (token && customerLocalData) {
            let data = JSON.parse(customerLocalData as string)
            dispatch(setName(data.name))
            dispatch(setPhone(data.phone))
        }
    }, [dispatch])

    return (
        <>
            <Helmet>
                <title>Шинка88 - Оформление заказа</title>
            </Helmet>
            <div className={PlacingOrderStyles.mainWrapper}>
                <div className={PlacingOrderStyles.contentWrapper}>
                    <p className="pageTitle">Оформление заказа</p>
                    <div className={PlacingOrderStyles.content}>
                        <div className={PlacingOrderStyles.leftBlock}>
                            <p className={PlacingOrderStyles.formTitle}>Получатель</p>
                            <div className={PlacingOrderStyles.form}>
                                <div className={PlacingOrderStyles.field}>
                                    <p className={PlacingOrderStyles.fieldTitle}>Имя *</p>
                                    <input type="text" className={PlacingOrderStyles.fieldInput}
                                        placeholder="Александр"
                                        onChange={(e) => dispatch(setName(e.target.value))}
                                        value={name} />
                                </div>
                                <div className={PlacingOrderStyles.field}>
                                    <p className={PlacingOrderStyles.fieldTitle}>Телефон *</p>
                                    <input type="text" className={PlacingOrderStyles.fieldInput}
                                        placeholder="7 999 999 99 99"
                                        onChange={(e) => dispatch(setPhone(e.target.value))}
                                        value={phone} />
                                </div>
                                {/* <div className={PlacingOrderStyles.field}>
                                <p className={PlacingOrderStyles.fieldTitle}>Почта</p>
                                <div>
                                    <input type="text" className={PlacingOrderStyles.fieldInput}
                                        placeholder="user@gmail.com" />
                                    <p className={PlacingOrderStyles.fieldHelpText}>
                                        на этот адрес будут приходить уведомления об изменении статуса заказа
                                    </p>
                                </div>
                            </div> */}
                                <p className={PlacingOrderStyles.formText}>
                                    Наш менеджер свяжется с Вами для подтверждения заказа</p>
                            </div>
                            <div className={PlacingOrderStyles.contacts}>
                                <p className={PlacingOrderStyles.formTitle}>Пункт выдачи</p>
                                <div className={PlacingOrderStyles.contactsInfo}>
                                    <div className={PlacingOrderStyles.contactsMap}>
                                        <div className={PlacingOrderStyles.map}
                                            style={{ position: "relative", overflow: "hidden" }}>
                                            <a href="https://yandex.ru/maps/10727/egorievsk/category/tire_service/184105260/?utm_medium=mapframe&utm_source=maps"
                                                style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '0px' }}>Шиномонтаж в Егорьевске</a>
                                            <a href="https://yandex.ru/maps/10727/egorievsk/category/engine_oils/53790807535/?utm_medium=mapframe&utm_source=maps"
                                                style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '14px' }}>Моторные масла в Егорьевске</a>
                                            <iframe src="https://yandex.ru/map-widget/v1/org/avto_opt/1015072993/?from=mapframe&ll=39.062357%2C55.382391&z=15" width="560" height="400" frameBorder="1" allowFullScreen={true} style={{ position: 'relative' }}></iframe></div>
                                    </div>
                                    <div className={PlacingOrderStyles.contactsText}>
                                        <div className={PlacingOrderStyles.contactsTextTop}>
                                            <p className={PlacingOrderStyles.address}>
                                                г. Егорьевск, ул. Рязанская, ГСК ЦЕНА<br />
                                                6 мкр-н, гаражи рядом с пожарным депо</p>
                                            <p><a href="https://yandex.ru/maps/org/avto_stop/1015072993?si=4j1jcathucrm7pd2zk4jtjvukg">Построить маршрут &#10148;</a></p>
                                        </div>
                                        <div className={PlacingOrderStyles.contactsTextBottom}>
                                            <p className={PlacingOrderStyles.firstTime}>летом с 8.00 до 23.00</p>
                                            <p className={PlacingOrderStyles.secondTime}>зимой с 9.00 до 19.00</p>
                                        </div>
                                    </div>
                                </div>
                                <p className={PlacingOrderStyles.mapHelpText}>
                                    Оплата производится при получении</p>
                            </div>

                        </div>
                        <OrderInfo nameButton='ОТПРАВИТЬ' name='Ваш заказ'
                            handler={buttonHandler} />
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}