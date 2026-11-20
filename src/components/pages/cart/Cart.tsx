import type React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './CartStyles.module.scss'
import { Footer } from '../../footer/Footer'
import { CartProductCard } from './blocks/cards/CartTyresCards'
import { OrderInfo } from '../blocks/orderInfo/OrderInfo'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { disksDataSelector, resetCart, selectAllHandler, selectAllSelector, tyresDataSelector } from '../../../app/slices/cartSlice'
import { Button } from '../../common/Button'
import { Modal } from '../../common/Modal'
import { Icon } from '../../common/Icon'

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const selectAll = useAppSelector(selectAllSelector)
  const tyres = useAppSelector(tyresDataSelector)
  const disks = useAppSelector(disksDataSelector)
  const [showClearModal, setShowClearModal] = useState(false)
  const products = [...tyres, ...disks].sort((a, b) => a.queue - b.queue)
  const isEmpty = products.length === 0

  return (
    <>
      <div className={styles.mainWrapper}>
        <main className={styles.contentWrapper}>
          <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
            <Link to="/">Главная</Link><Icon name="chevron" size={12} /><span aria-current="page">Корзина</span>
          </nav>
          <header className={styles.header}>
            <h1 className="pageTitle">Корзина</h1>
            <p>Проверьте параметры перед оформлением</p>
          </header>
          {isEmpty ? (
            <section className={styles.emptyState}>
              <Icon name="cart" size={48} />
              <h2>Корзина пуста</h2>
              <p>Добавьте шины или диски, чтобы оформить заказ</p>
              <Button onClick={() => navigate('/tires')} rightIcon={<Icon name="arrow" size={18} />}>Перейти в каталог</Button>
            </section>
          ) : (
            <>
              <div className={styles.actionForAll} role="group" aria-label="Действия с корзиной">
                <label className={styles.selectAll}>
                  <input type="checkbox" checked={selectAll} onChange={() => dispatch(selectAllHandler())} />
                  <span>Выбрать все</span>
                </label>
                <button className={styles.clearButton} type="button" onClick={() => setShowClearModal(true)}>Очистить корзину</button>
              </div>
              <div className={styles.content}>
                <div className={styles.leftBlock}>
                  <div className={styles.cards} role="list" aria-label="Товары в корзине">
                    {products.map(product => <CartProductCard data={product} key={`${product.product_type}-${product.id}`} />)}
                  </div>
                  <p className={styles.note}>Снятая галочка исключает позицию из суммы и состава заказа. Товар остаётся в корзине.</p>
                </div>
                <aside className={styles.rightBlock}>
                  <OrderInfo name="Ваш заказ" nameButton="К оформлению" handler={() => navigate('/placing_order')} />
                </aside>
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Очистить корзину?"
        description="Все товары будут удалены, включая позиции без галочки."
        size="sm"
        footer={<>
          <Button type="button" variant="ghost" onClick={() => setShowClearModal(false)}>Отмена</Button>
          <Button type="button" variant="danger" leftIcon={<Icon name="trash" size={18} />} onClick={() => { dispatch(resetCart()); setShowClearModal(false) }}>Очистить</Button>
        </>}
      >
        <p className={styles.confirmText}>Это действие нельзя отменить.</p>
      </Modal>
    </>
  )
}
