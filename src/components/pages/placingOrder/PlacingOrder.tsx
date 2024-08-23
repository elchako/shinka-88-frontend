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
        const phoneRegex = /^(?:\+7|7)\d{10}$/
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
        if (token) {
            const customerLocalData: string | null = localStorage.getItem('customerLocalData')
            let data = JSON.parse(customerLocalData as string)
            dispatch(setName(data.name))
            dispatch(setPhone(data.phone))
        }
    }, [dispatch])

    return (
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
                                    placeholder="+7 999 999 99 99"
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
                                    <div className={PlacingOrderStyles.map} style={{ position: "relative", overflow: "hidden" }}>
                                        <a href="https://yandex.ru/maps/10727/egorievsk/?utm_medium=mapframe&utm_source=maps"
                                            style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '0px' }}>Егорьевск</a>
                                        <a href="https://yandex.ru/maps/10727/egorievsk/?ll=39.079220%2C55.369847&mode=search&sctx=ZAAAAAgBEAAaKAoSCdGSx9PyuUNAEdoDrcCQTUlAEhIJI2k3%2BpgPtD8RaFw4EJIFnD8iBgABAgMEBSgKOABA51NIAWoCcnWdAc3MTD2gAQCoAQC9AZoVI1XCAQad9rSb%2BgKCAkfQnNCeLCDQsy4g0JXQs9C%2B0YDRjNC10LLRgdC6LCDRg9C7LiDQoNGP0LfQsNC90YHQutCw0Y8sINCT0KHQmiDQptCV0J3QkIoCAJICBTEwNzI3mgIMZGVza3RvcC1tYXBz&sll=39.078190%2C55.369847&sspn=0.004898%2C0.001531&text=%D0%9C%D0%9E%2C%20%D0%B3.%20%D0%95%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D1%81%D0%BA%2C%20%D1%83%D0%BB.%20%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%2C%20%D0%93%D0%A1%D0%9A%20%D0%A6%D0%95%D0%9D%D0%90&utm_medium=mapframe&utm_source=maps&whatshere%5Bpoint%5D=39.078142%2C55.370207&whatshere%5Bzoom%5D=17&z=14"
                                            style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '14px' }}>Яндекс Карты — транспорт, навигация, поиск мест</a>
                                        <iframe src="https://yandex.ru/map-widget/v1/?pt=39.079220%2C55.369847&z=14&l=map" width="682" height="422" frameBorder="1" allowFullScreen={true} style={{ position: 'relative' }}></iframe>

                                    </div>

                                </div>
                                <div className={PlacingOrderStyles.contactsText}>
                                    <div className={PlacingOrderStyles.contactsTextTop}>
                                        <p className={PlacingOrderStyles.address}>
                                            г. Егорьевск, ул. Рязанская, ГСК ЦЕНА<br />
                                            6 мкр-н, гаражи рядом с пожарным депо</p>
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
    )
}