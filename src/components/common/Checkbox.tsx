import type React from "react"
import styles from "./Checkbox.module.scss"

interface CheckboxProps {
  id?: string
  checked: boolean
  onChange: () => void
  label?: string
  disabled?: boolean
  className?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
  
  const classes = [
    styles.checkbox,
    checked && styles.checked,
    disabled && styles.disabled,
    className,
  ].filter(Boolean).join(' ')

  return (
    <label className={styles.container} htmlFor={checkboxId}>
      <span className={classes}>
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={styles.input}
          aria-checked={checked}
        />
        <span className={styles.checkmark} aria-hidden="true">
          {checked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </span>
      {label && (
        <span className={styles.label}>{label}</span>
      )}
    </label>
  )
}
