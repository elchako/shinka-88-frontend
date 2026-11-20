import type React from 'react'
import { Icon } from '../../common/Icon'
import model from '../../../imgs/refresh/promo-model.webp'
import styles from './PromoBanner.module.scss'

export const PromoBanner: React.FC = () => (
  <div className={styles.frame}>
    <a className={styles.banner} href="#product-picker" aria-label="Шиномонтаж и балансировка бесплатно при покупке 4 шин или литых дисков. На рынке с 2001 года. Перейти к подбору.">
      <div className={styles.condition}><h2>При покупке <br /><strong>4 шин</strong><br />или литых дисков</h2></div>
      <div className={styles.benefit}><p>Шиномонтаж<br />и балансировка</p><strong>бесплатно</strong><span className={styles.action}>Подобрать комплект<Icon name="arrow" size={16} /></span></div>
      <span className={styles.trust}>На рынке с <b>2001</b> года</span>
      <img className={styles.model} src={model} width="960" height="640" alt="" loading="eager" fetchPriority="high" decoding="async" />
    </a>
  </div>
)
