import type React from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import styles from './Modal.module.scss'
import { Button } from './Button'
import { Icon } from './Icon'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  mobileFullscreen?: boolean
  keepMounted?: boolean
}

const openModals: string[] = []
let savedBodyOverflow = ''
let nextLayer = 0

const focusableIn = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLElement>(
  'button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
)).filter(element => !element.closest('[hidden]') && element.getAttribute('aria-disabled') !== 'true' && getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden')

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, description, children, footer, size = 'md',
  closeOnOverlayClick = true, showCloseButton = true, mobileFullscreen = false, keepMounted = false,
}) => {
  const id = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const [layer, setLayer] = useState(0)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement as HTMLElement | null
    if (!openModals.length) savedBodyOverflow = document.body.style.overflow
    openModals.push(id)
    setLayer(++nextLayer)
    document.body.style.overflow = 'hidden'
    const content = contentRef.current
    const first = content && (content.querySelector<HTMLElement>('input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])') || focusableIn(content)[0])
    ;(first || content)?.focus()

    const handleKey = (event: KeyboardEvent) => {
      if (openModals[openModals.length - 1] !== id) return
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault()
        onCloseRef.current()
      }
      if (event.key !== 'Tab' || !contentRef.current) return
      const elements = focusableIn(contentRef.current)
      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]
      if (!firstElement) {
        event.preventDefault()
        contentRef.current.focus()
      } else if (event.shiftKey && (document.activeElement === firstElement || !contentRef.current.contains(document.activeElement))) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && (document.activeElement === lastElement || !contentRef.current.contains(document.activeElement))) {
        event.preventDefault()
        firstElement.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      const wasTop = openModals[openModals.length - 1] === id
      const index = openModals.indexOf(id)
      if (index !== -1) openModals.splice(index, 1)
      if (!openModals.length) {
        document.body.style.overflow = savedBodyOverflow
        nextLayer = 0
      }
      if (wasTop && previousFocus?.isConnected) previousFocus.focus()
    }
  }, [isOpen, id])

  if (!isOpen && !keepMounted) return null

  return (
    <div
      className={styles.overlay}
      style={{ zIndex: `calc(var(--z-modal, 300) + ${layer})`, display: isOpen ? undefined : 'none' }}
      aria-hidden={isOpen ? undefined : true}
      onClick={event => {
        if (closeOnOverlayClick && event.target === event.currentTarget) onCloseRef.current()
      }}
    >
      <div
        ref={contentRef}
        className={`${styles.content} ${styles[size]} ${mobileFullscreen ? styles.mobileFullscreen : ''}`}
        role={isOpen ? 'dialog' : undefined}
        aria-modal={isOpen ? true : undefined}
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={description ? `${id}-description` : undefined}
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className={styles.header}>
            <div>
              {title && <h2 id={`${id}-title`} className={styles.title}>{title}</h2>}
              {description && <p id={`${id}-description`} className={styles.description}>{description}</p>}
            </div>
            {showCloseButton && (
              <Button variant="ghost" size="sm" onClick={onClose} className={styles.closeButton} aria-label="Закрыть модальное окно">
                <Icon name="close" size={20} />
              </Button>
            )}
          </div>
        )}
        <div className={styles.body} tabIndex={mobileFullscreen ? 0 : undefined}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  )
}

interface ConfirmModalProps extends Omit<ModalProps, 'children' | 'footer'> {
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  isLoading?: boolean
  variant?: 'danger' | 'primary'
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  confirmText = 'Подтвердить', cancelText = 'Отмена', onConfirm, isLoading,
  variant = 'primary', description, ...props
}) => (
  <Modal {...props} footer={
    <div className={styles.confirmFooter}>
      <Button variant="outline" onClick={props.onClose}>{cancelText}</Button>
      <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>{confirmText}</Button>
    </div>
  }>
    <p className={styles.confirmText}>{description}</p>
  </Modal>
)
