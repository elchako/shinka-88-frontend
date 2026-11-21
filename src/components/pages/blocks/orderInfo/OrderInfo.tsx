import type React from 'react'
import { useState } from 'react'
import { ProductDetails } from '../../../common/ProductDetails'
import type { commonArrDataType } from '../../../../types/cart'
import styles from './OrderInfoStyles.module.scss'
import { Button } from '../../../common/Button'
import { Price } from '../../../common/Price'
import { Icon } from '../../../common/Icon'
import { useAppSelector } from '../../../../app/hooks'
import { orderPayloadSelector, selectedProductsSelector } from '../../../../app/slices/cartSlice'
import { cartProductSize } from '../../cart/blocks/cards/CartTyresCards'

interface IProps {
  name: string
  nameButton: string
  handler: () => void
  isLoading?: boolean
  disabled?: boolean
  formId?: string
}

export const OrderInfo: React.FC<IProps> = ({ name, nameButton, handler, isLoading = false, disabled = false, formId }) => {
  const products = useAppSelector(selectedProductsSelector)
  const [detail, setDetail] = useState<commonArrDataType[number] | null>(null)
  const order = useAppSelector(orderPayloadSelector)
  const selectedCount = products.reduce((sum, product) => sum + product.amount, 0)

  return (
    <section className={styles.mainWrapper} aria-label={name}>
      <h2 className={styles.title}>{name}</h2>
      {products.length ? (
        <ul className={styles.products} aria-label="Выбранные товары">
          {products.map(product => (
            <li className={styles.product} key={`${product.product_type}-${product.id}`}>
              <button type="button" className={styles.detailTrigger} onClick={() => setDetail(product)} aria-label={`Подробнее о товаре ${product.name}`}><img src={product.image_url} alt="" loading="lazy" /></button>
              <div>
                <p className={styles.productName}><button type="button" className={styles.detailTrigger} onClick={() => setDetail(product)}>{product.name}</button></p>
                <p className={styles.productDetails}>{cartProductSize(product)}</p>
                <div className={styles.calculation}>
                  {product.amount} шт. × <Price value={product.price_sale} size="sm" />
                  <span> = <Price value={product.price_sale * product.amount} size="sm" /></span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : <p className={styles.empty}>Нет выбранных товаров</p>}
      <dl className={styles.counts}>
        <div><dt>Выбрано товаров</dt><dd>{selectedCount} шт.</dd></div>
        <div><dt>Позиций в заказе</dt><dd>{products.length}</dd></div>
      </dl>
      <div className={styles.totalRow}>
        <span>Итого</span>
        <Price value={order.total_amount} size="xl" />
      </div>
      <Button
        variant="primary"
        fullWidth
        type={formId ? 'submit' : 'button'}
        form={formId}
        onClick={formId ? undefined : handler}
        isLoading={isLoading}
        disabled={disabled || products.length === 0 || order.total_amount <= 0}
        rightIcon={<Icon name="arrow" size={18} />}
      >
        {nameButton}
      </Button>
      <p className={styles.note}>Наличие и срок получения подтвердит менеджер. Оплата при получении.</p>
      {detail && <ProductDetails product={detail} isOpen onClose={() => setDetail(null)} />}
    </section>
  )
}
