import type React from "react"
import styles from "./OffenButton.module.scss"

interface IProps {
  name: string
  handler?: () => void
  buttonStyles?: string
  styles?: string  // для обратной совместимости
  disabled?: boolean
  isLoading?: boolean
  ariaLabel?: string
}

/**
 * @deprecated Используйте компонент Button из './Button' для новых компонентов
 */
export const OffenButton: React.FC<IProps> = ({ 
  name, 
  handler, 
  buttonStyles,
  styles: legacyStyles,
  disabled = false,
  isLoading = false,
  ariaLabel,
}) => {
  const classes = [
    styles.button,
    buttonStyles || legacyStyles,
    disabled && styles.disabled,
    isLoading && styles.loading,
  ].filter(Boolean).join(' ')

  return (
    <button 
      onClick={handler} 
      className={classes}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      type="button"
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <span className={styles.content}>{name}</span>
      )}
    </button>
  )
}
