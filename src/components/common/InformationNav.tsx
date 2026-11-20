import type React from 'react'
import { NavLink } from 'react-router-dom'
import { links } from '../../consts'
import styles from './InformationNav.module.scss'

export const InformationNav: React.FC = () => (
  <nav className={styles.navigation} aria-label="Информация магазина">
    {[links[8], links[12], links[14], links[13], links[11]].map(item => (
      <NavLink key={item.link} to={`/${item.link}`} className={({ isActive }) => isActive ? styles.active : undefined}>
        {item.title}
      </NavLink>
    ))}
  </nav>
)
