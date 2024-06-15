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
            <div className={ContactsStyles.map}
                style={{ position: "relative", overflow: "hidden" }}>
                <a href="https://yandex.ru/maps/10727/egorievsk/?utm_medium=mapframe&utm_source=maps"
                    style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '0px' }}>Егорьевск</a>
                <a href="https://yandex.ru/maps/10727/egorievsk/?ll=39.079220%2C55.369847&mode=search&sctx=ZAAAAAgBEAAaKAoSCdGSx9PyuUNAEdoDrcCQTUlAEhIJI2k3%2BpgPtD8RaFw4EJIFnD8iBgABAgMEBSgKOABA51NIAWoCcnWdAc3MTD2gAQCoAQC9AZoVI1XCAQad9rSb%2BgKCAkfQnNCeLCDQsy4g0JXQs9C%2B0YDRjNC10LLRgdC6LCDRg9C7LiDQoNGP0LfQsNC90YHQutCw0Y8sINCT0KHQmiDQptCV0J3QkIoCAJICBTEwNzI3mgIMZGVza3RvcC1tYXBz&sll=39.078190%2C55.369847&sspn=0.004898%2C0.001531&text=%D0%9C%D0%9E%2C%20%D0%B3.%20%D0%95%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D1%81%D0%BA%2C%20%D1%83%D0%BB.%20%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%2C%20%D0%93%D0%A1%D0%9A%20%D0%A6%D0%95%D0%9D%D0%90&utm_medium=mapframe&utm_source=maps&whatshere%5Bpoint%5D=39.078142%2C55.370207&whatshere%5Bzoom%5D=17&z=14"
                    style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '14px' }}>Яндекс Карты — транспорт, навигация, поиск мест</a>
                <iframe src="https://yandex.ru/map-widget/v1/?pt=39.079220%2C55.369847&z=14&l=map" width="682" height="422" frameBorder="1" allowFullScreen={true} style={{ position: 'relative' }}></iframe>
            </div>
        </div>
    )
}