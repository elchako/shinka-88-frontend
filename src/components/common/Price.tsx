import type React from "react"
import styles from "./Price.module.scss"

interface PriceProps {
  value: number
  currency?: 'RUB' | 'USD' | 'EUR'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'sale' | 'old'
  className?: string
  showDecimals?: boolean
}

export const Price: React.FC<PriceProps> = ({
  value,
  currency = 'RUB',
  size = 'md',
  variant = 'default',
  className = '',
  showDecimals = false,
}) => {
  const formatPrice = (val: number): string => {
    const hasFraction = Math.abs(val - Math.round(val)) > 0.000001
    const formatter = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: showDecimals || hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
    })
    return formatter.format(val)
  }

  const getCurrencySymbol = (curr: string): string => {
    switch (curr) {
      case 'USD':
        return '$'
      case 'EUR':
        return '€'
      case 'RUB':
      default:
        return '₽'
    }
  }

  const priceClasses = [
    styles.price,
    styles[size],
    styles[variant],
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={priceClasses}>
      <span className={styles.amount}>{formatPrice(value)}</span>
      <span className={styles.currency}>{getCurrencySymbol(currency)}</span>
    </span>
  )
}

// Price with old price (sale)
interface SalePriceProps extends Omit<PriceProps, 'variant'> {
  oldPrice: number
  newPrice: number
}

export const SalePrice: React.FC<SalePriceProps> = ({
  oldPrice,
  newPrice,
  ...props
}) => {
  const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100)

  return (
    <div className={styles.saleContainer}>
      <Price {...props} value={newPrice} variant="sale" />
      <div className={styles.oldPriceContainer}>
        <Price {...props} value={oldPrice} variant="old" size="sm" />
        {discount > 0 && (
          <span className={styles.discountBadge}>-{discount}%</span>
        )}
      </div>
    </div>
  )
}
