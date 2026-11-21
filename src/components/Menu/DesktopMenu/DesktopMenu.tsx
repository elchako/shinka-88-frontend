import type React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './DesktopMenu.module.scss'
import { links } from '../../../consts'

export const DesktopMenu: React.FC = () => (
  <div className={styles.mainWrapper}>
    <nav className={styles.mainMenu} aria-label="Основная навигация">
      {[links[8], links[3], links[4], links[5], links[6], links[7]].map(item => (
        <NavLink key={item.link} to={`/${item.link}`} className={({ isActive }) => isActive ? styles.active : undefined}>
          {item.title}
        </NavLink>
      ))}
    </nav>
  </div>
)
