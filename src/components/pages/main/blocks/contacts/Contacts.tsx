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
                </div>
                <div className={ContactsStyles.contactsBlock}>
                    <p className={ContactsStyles.title}>ЧАСЫ РАБОТЫ:</p>
                    <p className={ContactsStyles.text}>
                        летом с 8.00 до 23.00,<br />
                        зимой с 9.00 до 19.00
                    </p>
                </div>
            </div>
            <div className={ContactsStyles.map}></div>
        </div>
    )
}