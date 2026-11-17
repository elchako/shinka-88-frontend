import type React from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from './Icon'
import styles from './QuantityStepper.module.scss'

interface QuantityStepperProps {
  value: number
  max: number
  min?: number
  onDecrease: () => void
  onIncrease: () => void
  label?: string
  className?: string
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value, max, min = 1, onDecrease, onIncrease, label = 'Товар', className = '',
}) => {
  const stock = Number.isFinite(max) ? Math.max(0, Math.floor(max)) : 0
  const atLimit = value >= stock
  const [showLimit, setShowLimit] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stockId = useId()

  useEffect(() => {
    setShowLimit(false)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [value, stock])

  const increase = () => {
    if (atLimit) {
      setShowLimit(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setShowLimit(false), 2500)
      return
    }
    onIncrease()
  }

  return (
    <div className={`${styles.control} ${className}`} role="group" aria-label={`Количество: ${label}`} aria-describedby={stockId}>
      <div className={styles.stepper}>
        <button type="button" onClick={onDecrease} disabled={value <= min} aria-label={`Уменьшить количество: ${label}`}>
          <Icon name="minus" size={16} />
        </button>
        <output aria-label="Выбрано штук" aria-live="polite" aria-atomic="true">{value}</output>
        <button type="button" onClick={increase} disabled={stock === 0} aria-disabled={atLimit}
          aria-describedby={stockId} aria-label={`Увеличить количество: ${label}`}>
          <Icon name="plus" size={16} />
        </button>
      </div>
      <p id={stockId} className={`${styles.availability} ${showLimit ? styles.limit : ''}`}
        role="status" aria-label="Доступность товара" aria-live="polite" aria-atomic="true">
        {stock === 0 ? 'Нет в наличии' : showLimit ? `Доступно только ${stock} шт.` : `Доступно: ${stock} шт.`}
      </p>
    </div>
  )
}
