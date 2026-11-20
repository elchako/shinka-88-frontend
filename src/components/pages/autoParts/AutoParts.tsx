import type React from 'react'
import { Footer } from '../../footer/Footer'
import { Icon } from '../../common/Icon'
import { links } from '../../../consts'
import styles from './AutoPartsStyles.module.scss'

export const AutoParts: React.FC = () => (
  <>
    <div className={styles.mainWrapper}>
      <div className={styles.content}>
        <h1 className="pageTitle">Автозапчасти</h1>
        <section className={styles.searchBlock} aria-labelledby="parts-heading">
          <h2 id="parts-heading">Поможем уточнить подбор</h2>
          <p>Для подбора запчастей по VIN свяжитесь с менеджером магазина. Онлайн-поиск в этом разделе пока недоступен.</p>
          <a className={styles.phone} href={links[2].link}><Icon name="phone" size={20} />{links[2].title}</a>
        </section>
      </div>
      <Footer />
    </div>
  </>
)
