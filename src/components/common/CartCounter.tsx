import type React from 'react'
import styles from './CartCounter.module.scss'
import { useAppSelector } from '../../app/hooks'
import { disksDataSelector, tyresDataSelector } from '../../app/slices/cartSlice'

export const CartCounter: React.FC = () => {
  const tyres = useAppSelector(tyresDataSelector)
  const disks = useAppSelector(disksDataSelector)
  const amount = [...tyres, ...disks].reduce((sum, item) => sum + item.amount, 0)
  if (!amount) return null
  return <span className={styles.badge} aria-hidden="true">{amount}</span>
}
