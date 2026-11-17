import type React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './HeaderStyles.module.scss'
import { Logo } from '../common/Logo'
import { Icon } from '../common/Icon'
import { CartCounter } from '../common/CartCounter'
import { links } from '../../consts'

export const MobileHeader: React.FC = () => (
  <header className={styles.mobileHeader}>
    <div className={styles.mobileMainWrapper}>
      <Logo logoImg={styles.logoImgMobile} title={styles.titleMobile} logo={styles.logo} />
      <div className={styles.mobileActions}>
        <a href={links[2].link} className={styles.mobilePhone} aria-label={`Позвонить: ${links[2].title}`}>
          <Icon name="phone" size={20} />
        </a>
        <NavLink to={`/${links[1].link}`} className={styles.mobileCart} aria-label="Корзина">
          <Icon name="cart" size={24} /><CartCounter />
        </NavLink>
      </div>
    </div>
  </header>
)
