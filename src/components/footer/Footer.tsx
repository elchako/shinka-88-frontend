import type React from 'react'
import { NavLink } from 'react-router-dom'
import { Logo } from '../common/Logo'
import { links } from '../../consts'
import styles from './FooterStyles.module.scss'

interface FooterProps { compact?: boolean }

export const Footer: React.FC<FooterProps> = ({ compact = false }) => (
  <footer className={styles.mainWrapper}>
    <div className={styles.content}>
      <div className={styles.columns}>
        <div>
          <Logo logoImg={styles.logoImg} title={styles.title} logo={styles.logo} />
          <p className={styles.since}>На рынке с 2001 года</p>
          {!compact && <p className={styles.address}>Егорьевск, ул. Рязанская, ГСК ЦЕНА<br />8:00-20:00<br /><a href={links[2].link}>{links[2].title}</a></p>}
        </div>
        <nav className={styles.links} aria-label="Каталог и магазин">
          <h2>Каталог и магазин</h2>
          <NavLink to="/tires">Шины</NavLink><NavLink to="/disks">Диски</NavLink><NavLink to="/aboutUs">О нас</NavLink><NavLink to="/purchaser">Покупателю</NavLink>
        </nav>
        <nav className={styles.links} aria-label="Документы">
          <h2>Документы</h2>
          <NavLink to="/oferta">Оферта</NavLink><NavLink to="/police">Политика конфиденциальности</NavLink><NavLink to="/autoParts">Автозапчасти</NavLink>
        </nav>
      </div>
      <p className={styles.coop}>©{new Date().getFullYear()} Шинка88. Все права защищены.</p>
    </div>
  </footer>
)
