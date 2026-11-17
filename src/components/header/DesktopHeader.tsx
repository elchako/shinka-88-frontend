import type React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './HeaderStyles.module.scss'
import { Logo } from '../common/Logo'
import { Icon } from '../common/Icon'
import { CartCounter } from '../common/CartCounter'
import { Price } from '../common/Price'
import { useAppSelector } from '../../app/hooks'
import { priceAmountSelector } from '../../app/slices/cartSlice'
import { links } from '../../consts'

export const DesktopHeader: React.FC = () => {
  const total = useAppSelector(priceAmountSelector)
  return (
    <header className={styles.header}>
      <div className={styles.mainWrapper}>
        <Logo logoImg={styles.logoImg} title={styles.title} logo={styles.logo} />
        <div className={styles.data}>
          <a href={links[2].link} className={styles.phone} aria-label={`Позвонить: ${links[2].title}`}>
            <Icon name="phone" size={20} /><span>{links[2].title}</span>
          </a>
          <NavLink to={`/${links[1].link}`} className={styles.cart} aria-label={`Корзина, сумма ${total} рублей`}>
            <span className={styles.cartImg}><Icon name="cart" size={25} /><CartCounter /></span>
            <span className={styles.cartInfo}><span className={styles.cartLabel}>Корзина</span><Price value={total} size="sm" /></span>
          </NavLink>
        </div>
      </div>
    </header>
  )
}
