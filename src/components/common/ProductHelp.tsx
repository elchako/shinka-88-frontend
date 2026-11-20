import { links } from '../../consts'
import styles from './ProductHelp.module.scss'

export const ProductHelp = () => (
  <aside className={styles.help} aria-label="Помощь с поиском товара">
    <p><strong>Не нашли нужный товар?</strong> Свяжитесь с нами, поможем его найти.</p>
    <a href={links[2].link}>{links[2].title}</a>
  </aside>
)
