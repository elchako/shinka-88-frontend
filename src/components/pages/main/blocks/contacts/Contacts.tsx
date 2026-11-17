import type React from 'react'
import { Icon } from '../../../../common/Icon'
import { links } from '../../../../../consts'
import styles from './ContactsStyles.module.scss'

export const STORE_MAP_URL = 'https://yandex.ru/maps/org/avto_stop/1015072993?si=4j1jcathucrm7pd2zk4jtjvukg'
export const STORE_MAP_WIDGET = 'https://yandex.ru/map-widget/v1/org/avto_opt/1015072993/?from=mapframe&ll=39.062357%2C55.382391&z=15'

export const Contacts: React.FC = () => (
  <section className={styles.mainWrapper} id="store-location" aria-labelledby="store-location-title">
    <h2 className={styles.heading} id="store-location-title">Как нас найти</h2>
    <div className={styles.layout}>
      <div className={styles.contacts}>
        <div className={styles.contactsBlock}><span className={styles.label}><Icon name="pin" size={20} />Адрес магазина</span><p className={styles.address}>МО, г. Егорьевск, ул. Рязанская, ГСК ЦЕНА</p></div>
        <div className={styles.contactsBlock}><span className={styles.label}>Ориентир</span><p className={styles.text}>6 мкр-н, гаражи рядом с пожарным депо</p></div>
        <div className={styles.contactsBlock}><span className={styles.label}><Icon name="clock" size={20} />Часы работы</span><p className={styles.hours}>с 8:00 до 20:00</p></div>
        <div className={styles.actions}>
          <a className={styles.route} href={STORE_MAP_URL} target="_blank" rel="noopener noreferrer"><Icon name="map" size={19} />Построить маршрут<Icon name="arrow" size={16} /></a>
          <a className={styles.phone} href={links[2].link}><Icon name="phone" size={18} />{links[2].title}</a>
        </div>
      </div>
      <div className={styles.map}><iframe title="Шинка88 на Яндекс Картах" src={STORE_MAP_WIDGET} width="560" height="320" loading="eager" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
    </div>
  </section>
)
