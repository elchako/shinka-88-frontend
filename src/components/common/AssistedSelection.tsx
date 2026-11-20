import { Link } from 'react-router-dom'
import { links } from '../../consts'
import { Icon } from './Icon'
import styles from './AssistedSelection.module.scss'

export type AssistedCategory = 'oils' | 'akb' | 'autoParts'
export const assistedCategories = {
  oils: { title: 'Масла', heading: 'Подбор масла через магазин', text: 'Сообщите марку и модель автомобиля, двигатель, нужную вязкость и допуски, если они известны.' },
  akb: { title: 'Аккумуляторы', heading: 'Подбор аккумулятора через магазин', text: 'Сообщите марку и модель автомобиля. Если знаете, подготовьте размеры аккумулятора, ёмкость и полярность.' },
  autoParts: { title: 'Автозапчасти', heading: 'Поможем уточнить подбор', text: 'Для подбора запчастей подготовьте VIN автомобиля или артикул нужной детали и свяжитесь с магазином.' },
} as const

export const AssistedSelection = ({ category, showPageLink = false }: { category: AssistedCategory, showPageLink?: boolean }) => {
  const data = assistedCategories[category]
  return <section className={styles.content} aria-label={data.heading}>
    <h2>{data.heading}</h2>
    <p>{data.text}</p>
    <p>Онлайн-поиск в этом разделе пока недоступен. Наличие, цену и срок получения уточняйте у магазина.</p>
    <div className={styles.actions}><a className={styles.phone} href={links[2].link}><Icon name="phone" size={18} />{links[2].title}</a>
      {showPageLink && <Link to={`/${category}`}>Подробнее о подборе</Link>}
    </div>
  </section>
}
