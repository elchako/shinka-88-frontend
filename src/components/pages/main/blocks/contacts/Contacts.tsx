import type React from "react"
import ContactsStyles from "./ContactsStyles.module.scss"


export const Contacts: React.FC = () => {
    return (
        <div className={ContactsStyles.mainWrapper}>
            <div className={ContactsStyles.contacts}>
                <div className={ContactsStyles.contactsBlock}>
                    <p className={ContactsStyles.title}>МЫ НАХОДИМСЯ ПО АДРЕСУ:</p>
                    <p className={ContactsStyles.text}>МО, г. Егорьевск, ул. Рязанская, ГСК ЦЕНА</p>
                </div>
                <div className={ContactsStyles.contactsBlock}>
                    <p className={ContactsStyles.title}>ОРИЕНТИР:</p>
                    <p className={ContactsStyles.text}>6 мкр-н, гаражи рядом с пожарным депо</p>
                    <p><a href="https://yandex.ru/maps/org/avto_stop/1015072993?si=4j1jcathucrm7pd2zk4jtjvukg"
                        target="_blank">Построить маршрут &#10148;</a></p>
                </div>
                <div className={ContactsStyles.contactsBlock}>
                    <p className={ContactsStyles.title}>ЧАСЫ РАБОТЫ:</p>
                    <p className={ContactsStyles.text}>
                        с 8.00 до 20.00
                    </p>
                </div>
            </div>
            <div className={ContactsStyles.map}
                style={{ position: "relative", overflow: "hidden" }}>
                <a href="https://yandex.ru/maps/10727/egorievsk/category/tire_service/184105260/?utm_medium=mapframe&utm_source=maps"
                    style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '0px' }}>Шиномонтаж в Егорьевске</a>
                <a href="https://yandex.ru/maps/10727/egorievsk/category/engine_oils/53790807535/?utm_medium=mapframe&utm_source=maps"
                    style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '14px' }}>Моторные масла в Егорьевске</a>
                <iframe src="https://yandex.ru/map-widget/v1/org/avto_opt/1015072993/?from=mapframe&ll=39.062357%2C55.382391&z=15" width="560" height="400" frameBorder="1" allowFullScreen={true} style={{ position: 'relative' }}></iframe></div>
        </div>
    )
}