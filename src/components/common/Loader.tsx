import type React from "react"
import styles from "./Loader.module.scss"

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'white'
  className?: string
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const loaderClasses = [
    styles.loader,
    styles[size],
    styles[variant],
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={loaderClasses} role="status" aria-label="Загрузка">
      <span className={styles.spinner} aria-hidden="true" />
    </span>
  )
}

// Skeleton loader для карточек
interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  circle?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  circle = false,
}) => {
  const skeletonClasses = [
    styles.skeleton,
    circle && styles.circle,
    className,
  ].filter(Boolean).join(' ')

  const style: React.CSSProperties = {
    width: width,
    height: height,
  }

  return (
    <span 
      className={skeletonClasses} 
      style={style}
      aria-hidden="true"
    />
  )
}

// Product card skeleton
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className={styles.cardSkeleton}>
      <Skeleton height={160} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <Skeleton height={20} width="80%" />
        <Skeleton height={16} width="60%" />
        <div className={styles.cardFooter}>
          <Skeleton height={24} width="40%" />
          <Skeleton height={40} width="80px" />
        </div>
      </div>
    </div>
  )
}
