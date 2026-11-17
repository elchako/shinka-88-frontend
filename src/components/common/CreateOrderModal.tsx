import type React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { creatingOrderSelector, orderIsCreating, orderNumberSelector } from '../../app/slices/cartSlice'
import { Modal } from './Modal'
import { Button } from './Button'
import { Icon } from './Icon'
import { Loader } from './Loader'
import styles from './CreateOrderModal.module.scss'

export const CreateOrder: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const creatingOrder = useAppSelector(creatingOrderSelector)
  const orderNumber = useAppSelector(orderNumberSelector)
  const close = () => {
    if (creatingOrder) return
    dispatch(orderIsCreating())
    navigate('/')
  }

  return (
    <Modal
      isOpen={creatingOrder || orderNumber > 0}
      onClose={close}
      title={creatingOrder ? 'Оформляем заказ' : 'Заказ оформлен'}
      showCloseButton={!creatingOrder}
      closeOnOverlayClick={!creatingOrder}
      size="sm"
      footer={!creatingOrder ? <Button type="button" fullWidth onClick={close}>На главную</Button> : undefined}
    >
      <div className={styles.content} role="status">
        {creatingOrder ? (
          <><Loader size="md" /><p>Отправляем заказ. Пожалуйста, дождитесь ответа.</p></>
        ) : (
          <><Icon name="check" size={28} /><p className={styles.number}>Номер вашего заказа: {orderNumber}</p><p>Скоро с вами свяжется менеджер для подтверждения деталей.</p></>
        )}
      </div>
    </Modal>
  )
}
