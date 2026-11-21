import type React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './CartStyles.module.scss'
import { Footer } from '../../footer/Footer'
import { CartProductCard } from './blocks/cards/CartTyresCards'
import { OrderInfo } from '../blocks/orderInfo/OrderInfo'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { delOneTypeProduct, disksDataSelector, resetCart, selectAllHandler, selectAllSelector, tyresDataSelector } from '../../../app/slices/cartSlice'
import type { commonArrDataType } from '../../../types/cart'
import { Button } from '../../common/Button'
import { ConfirmModal } from '../../common/Modal'
import { Icon } from '../../common/Icon'

type CartConfirmation = { type: 'clear' } | {
  type: 'remove'
  product: Pick<commonArrDataType[number], 'id' | 'product_type' | 'name'>
}

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const selectAll = useAppSelector(selectAllSelector)
  const tyres = useAppSelector(tyresDataSelector)
  const disks = useAppSelector(disksDataSelector)
  const [confirmation, setConfirmation] = useState<CartConfirmation | null>(null)
  const products = [...tyres, ...disks].sort((a, b) => a.queue - b.queue)
  const isEmpty = products.length === 0
  const closeConfirmation = () => setConfirmation(null)
  const confirmRemoval = () => {
    if (confirmation?.type === 'clear') dispatch(resetCart())
    else if (confirmation?.type === 'remove') {
      dispatch(delOneTypeProduct({ productType: confirmation.product.product_type, id: confirmation.product.id }))
    }
    closeConfirmation()
  }

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
                <button className={styles.clearButton} type="button" onClick={() => setConfirmation({ type: 'clear' })}>Очистить корзину</button>
              </div>
              <div className={styles.content}>
                <div className={styles.leftBlock}>
                  <div className={styles.cards} role="list" aria-label="Товары в корзине">
                    {products.map(product => <CartProductCard data={product} onRemove={() => setConfirmation({ type: 'remove', product })} key={`${product.product_type}-${product.id}`} />)}
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
      <ConfirmModal
        isOpen={confirmation !== null}
        onClose={closeConfirmation}
        onConfirm={confirmRemoval}
        title={confirmation?.type === 'clear' ? 'Очистить корзину?' : 'Удалить товар из корзины?'}
        description={confirmation?.type === 'remove'
          ? `Удалить «${confirmation.product.name}» из корзины?`
          : 'Все товары будут удалены, включая позиции без галочки. Это действие нельзя отменить.'}
        confirmText={confirmation?.type === 'clear' ? 'Очистить' : 'Удалить'}
        variant="danger"
        size="sm"
      />
    </>
  )
}
