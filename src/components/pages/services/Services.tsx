import { useEffect, useState } from 'react'
import { servicesApi, type ServiceGroup } from '../../../api/services'
import { Footer } from '../../footer/Footer'
import { InformationNav } from '../../common/InformationNav'
import { Button } from '../../common/Button'
import { links } from '../../../consts'
import styles from './Services.module.scss'

const rubles = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 2 })
export const servicePrice = (price: string | null) => price !== null && price.trim() !== '' && Number.isFinite(Number(price)) && Number(price) >= 0 ? rubles.format(Number(price)) : 'Уточняйте'

export const Services = () => {
  const [groups, setGroups] = useState<ServiceGroup[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    servicesApi.get(controller.signal).then(data => {
      if (controller.signal.aborted) return
      setGroups(data.groups)
      setStatus('ready')
    }).catch(() => { if (!controller.signal.aborted) setStatus('error') })
    return () => controller.abort()
  }, [attempt])
  return <>
    <main className={styles.page}>
      <h1 className="pageTitle">Услуги и цены</h1>
      <div className={styles.layout}>
        <InformationNav />
        <div className={styles.article}>
          <section className={styles.intro} aria-labelledby="services-complex">
            <h2 id="services-complex">Шиномонтаж четырёх колёс с балансировкой</h2>
            <p>Стоимость комплекса зависит от размера колёс и класса автомобиля. Цены ниже указаны за четыре колеса.</p>
          </section>
          <section className={styles.discount} aria-labelledby="service-discount">
            <h2 id="service-discount">Скидка 10% постоянным клиентам</h2>
            <p>На комплексный шиномонтаж с 1 декабря по 1 апреля и с 1 июня по 1 ноября.</p>
          </section>
          {status === 'loading' && <p className={styles.status} role="status">Загружаем актуальный прайс…</p>}
          {status === 'error' && <div className={styles.status} role="alert">
            <p>Не удалось загрузить прайс. Повторите попытку или уточните стоимость по телефону.</p>
            <Button variant="outline" onClick={() => setAttempt(value => value + 1)}>Повторить загрузку прайса</Button>
          </div>}
          {status === 'ready' && (groups.length ? groups.map(group => <section key={group.id} className={styles.group} aria-labelledby={`service-group-${group.id}`}>
            <h2 id={`service-group-${group.id}`}>{group.name}</h2>
            {group.description && <p className={styles.description}>{group.description}</p>}
            <table className={styles.prices} aria-labelledby={`service-group-${group.id}`}>
              <thead><tr><th scope="col">Услуга</th><th scope="col">Стоимость</th></tr></thead>
              <tbody>{group.items.map(item => <tr key={item.id}>
                <th scope="row"><span>{item.name}</span>{item.description && item.description !== group.description && <small>{item.description}</small>}</th>
                <td><strong>{servicePrice(item.price)}</strong>{item.unit && <small>{item.unit}</small>}</td>
              </tr>)}</tbody>
            </table>
          </section>) : <p className={styles.status}>Прайс обновляется. Уточните стоимость по телефону магазина.</p>)}
          <section className={styles.contact} aria-labelledby="service-contact">
            <h2 id="service-contact">Уточнить услуги и стоимость</h2>
            <p>Свяжитесь с магазином, чтобы уточнить стоимость, условия услуг и действие скидок.</p>
            <a href={links[2].link}>{links[2].title}</a>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </>
}
