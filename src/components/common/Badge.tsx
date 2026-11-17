import type React from "react"
import styles from "./Badge.module.scss"

export type BadgeVariant = 'summer' | 'winter' | 'runflat' | 'strong' | 'default' | 'primary' | 'success' | 'warning' | 'error'
export type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  icon,
  className = '',
}) => {
  const badgeClasses = [
    styles.badge,
    styles[variant],
    styles[size],
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={badgeClasses}>
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span className={styles.text}>{children}</span>
    </span>
  )
}

// Season badge with icon
interface SeasonBadgeProps {
  season: 'лето' | 'зима' | 'всесезонные'
}

export const SeasonBadge: React.FC<SeasonBadgeProps> = ({ season }) => {
  const variant = season === 'лето' ? 'summer' : season === 'зима' ? 'winter' : 'default'
  const icon = season === 'лето' ? '☀️' : season === 'зима' ? '❄️' : '🌤️'
  
  return (
    <Badge variant={variant} icon={icon}>
      {season}
    </Badge>
  )
}

// RunFlat badge
export const RunflatBadge: React.FC = () => (
  <Badge variant="runflat" icon="🛡️">
    RunFlat
  </Badge>
)

// Strong/Усиленная badge
export const StrongBadge: React.FC = () => (
  <Badge variant="strong" icon="💪">
    Усиленная
  </Badge>
)
