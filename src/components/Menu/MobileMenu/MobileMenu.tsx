import type React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { mobileMenuReducer, mobileMenuSelector } from '../../../app/slices/common/smallActions'
import { Icon } from '../../common/Icon'
import { CartCounter } from '../../common/CartCounter'
import styles from './MobileMenu.module.scss'

export const MobileMenu: React.FC = () => {
  const dispatch = useAppDispatch()
  const closed = useAppSelector(mobileMenuSelector)
  const { pathname } = useLocation()
  const inCatalog = pathname === '/tires' || pathname === '/disks'
  return (
    <nav className={styles.mainWrapper} aria-label="Мобильная навигация">
      <NavLink end to="/" className={({ isActive }) => `${styles.bottomMenuItem} ${isActive ? styles.active : ''}`}><Icon name="home" size={21} /><span>Главная</span></NavLink>
      <NavLink to="/services" className={({ isActive }) => `${styles.bottomMenuItem} ${isActive ? styles.active : ''}`}><Icon name="price" size={21} /><span>Цены</span></NavLink>
      <Link to="/tires" className={`${styles.bottomMenuItem} ${inCatalog ? styles.active : ''}`} aria-current={inCatalog ? 'page' : undefined}><Icon name="grid" size={21} /><span>Каталог</span></Link>
      <NavLink to="/cart" className={({ isActive }) => `${styles.bottomMenuItem} ${isActive ? styles.active : ''}`}><span className={styles.iconWrap}><Icon name="cart" size={21} /><CartCounter /></span><span>Корзина</span></NavLink>
      <button type="button" className={styles.bottomMenuItem} onClick={() => dispatch(mobileMenuReducer())} aria-haspopup="dialog" aria-expanded={!closed}><Icon name="menu" size={21} /><span>Меню</span></button>
    </nav>
  )
}
