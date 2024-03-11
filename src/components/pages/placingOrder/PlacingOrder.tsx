import type React from "react"
import PlacingOrderStyles from "./PlacingOrderStyles.module.scss"
import '../../../common.scss'
import { Footer } from "../../footer/Footer"
import { OrderInfo } from "../blocks/orderInfo/OrderInfo";


export const PlacingOrder: React.FC = () => {
    return (
        <div className={PlacingOrderStyles.mainWrapper}>
            <p className="pageTitle">Оформление заказа</p>
            <div className={PlacingOrderStyles.content}>
                <div className={PlacingOrderStyles.leftBlock}>
                    <p className={PlacingOrderStyles.formTitle}>Получатель</p>
                    <div className={PlacingOrderStyles.form}>
                        <div className={PlacingOrderStyles.field}>
                            <p className={PlacingOrderStyles.fieldTitle}>Имя *</p>
                            <input type="text" className={PlacingOrderStyles.fieldInput}
                                placeholder="Александр" />
                        </div>
                        <div className={PlacingOrderStyles.field}>
                            <p className={PlacingOrderStyles.fieldTitle}>Телефон *</p>
                            <input type="text" className={PlacingOrderStyles.fieldInput}
                                placeholder="+7 999 999 99 99" />
                        </div>
                        <div className={PlacingOrderStyles.field}>
                            <p className={PlacingOrderStyles.fieldTitle}>Почта *</p>
                            <div>
                                <input type="text" className={PlacingOrderStyles.fieldInput}
                                    placeholder="user@gmail.com" />
                                <p className={PlacingOrderStyles.fieldHelpText}>
                                    на этот адрес будут приходить уведомления об изменении статуса заказа
                                </p>
                            </div>
                        </div>
                        <p className={PlacingOrderStyles.formText}>
                            Наш менеджер свяжется с Вами для подтверждения заказа</p>
                    </div>
                    <div className={PlacingOrderStyles.contacts}>
                        <p className={PlacingOrderStyles.formTitle}>Пункт выдачи</p>
                        <div className={PlacingOrderStyles.contactsInfo}>
                            <div className={PlacingOrderStyles.contactsMap}>
                                <div className={PlacingOrderStyles.map}></div>
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
                <OrderInfo nameButton='ОТПРАВИТЬ' name='Ваш заказ' />
            </div>
            <Footer />
        </div>
    )
}