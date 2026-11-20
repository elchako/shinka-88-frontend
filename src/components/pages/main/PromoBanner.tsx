import type React from 'react'
import { Icon } from '../../common/Icon'
import model from '../../../imgs/refresh/promo-model.webp'
import styles from './PromoBanner.module.scss'

export const PromoBanner: React.FC = () => (
  <div className={styles.frame}>
    <a
      className={styles.banner}
      href="#product-picker"
      aria-label="Шиномонтаж и балансировка бесплатно при покупке 4 шин или литых дисков. Снятие колёс включено. На рынке с 2001 года. Перейти к подбору."
    >
      <div className={styles.art} aria-hidden="true">
        <svg viewBox="0 0 475 250" preserveAspectRatio="xMaxYMid slice">
          <circle cx="284" cy="137" r="141" />
          <circle cx="284" cy="137" r="174" />
          <circle cx="284" cy="137" r="207" />
        </svg>
      </div>
      <img className={styles.model} src={model} width="960" height="640" alt="" loading="eager" fetchPriority="high" decoding="async" />
      <div className={styles.copy}>
        <div className={styles.message}>
          <h2 className={styles.title}>
            <span>Шиномонтаж <span className={styles.keep}>и балансировка</span></span>{' '}
            <strong>бесплатно</strong>
          </h2>
          <p className={styles.condition}>При покупке <b>4 шин <span className={styles.keep}>или литых дисков</span></b></p>
          <p className={styles.detail}>Снятие колёс включено</p>
        </div>
        <div className={styles.footer}>
          <span className={styles.action}>Подобрать комплект<Icon name="arrow" size={16} /></span>
          <span className={styles.trust}>На рынке с <b>2001</b> года</span>
        </div>
      </div>
    </a>
  </div>
)
