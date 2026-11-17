import type React from 'react'
import styles from './CartCardsStyles.module.scss'
import { useAppDispatch } from '../../../../../app/hooks'
import { changeAmount, delOneTypeProduct, selectProductHandler } from '../../../../../app/slices/cartSlice'
import type { commonArrDataType, selectedType } from '../../../../../types/cart'
import type { resultsTyresType } from '../../../../../types/tires'
import { Icon } from '../../../../common/Icon'
import { Price } from '../../../../common/Price'
import { QuantityStepper } from '../../../../common/QuantityStepper'
import { hasProductFeature } from '../../../../../utils/other'

type CartProduct = commonArrDataType[number]

export const cartProductSize = (product: CartProduct): string => {
  if ('holesquant' in product) {
    return [
      `${product.width}×${product.diameter}`,
      product.pcd ? (/[x×]/i.test(product.pcd) || !product.holesquant ? product.pcd : `${product.holesquant}×${product.pcd}`) : '',
      product.wheeloffset ? `ET${product.wheeloffset}` : '',
      product.dia ? `DIA ${product.dia}` : '',
    ].filter(Boolean).join(' · ')
  }
  const diameter = /^r/i.test(product.diameter) ? product.diameter : `R${product.diameter}`
  return `${product.width}/${product.height} ${diameter} ${product.load || ''}${product.speed || ''}`.trim()
}

export const CartProductCard: React.FC<{ data: CartProduct }> = ({ data }) => {
  const dispatch = useAppDispatch()
  const isTyre = 'seazon' in data

  return (
    <article className={`${styles.card} ${data.canceled ? styles.excluded : ''}`} role="listitem">
      <label className={styles.select}>
        <input
          type="checkbox"
          checked={!data.canceled}
          aria-label={`Выбрать ${data.name}`}
          onChange={() => dispatch(selectProductHandler({ productType: data.product_type, id: data.id }))}
        />
      </label>
      <div className={styles.imageWrapper}>
        <img src={data.image_url} alt="" loading="lazy" className={styles.image} />
      </div>
      <div className={styles.info}>
        <h2 className={styles.name}>{data.name}</h2>
        <p className={styles.size}>{cartProductSize(data)}</p>
        <p className={styles.details}>
          {isTyre ? `${data.seazon}, шины${hasProductFeature(data.runflat) ? ' · RunFlat' : ''}` : data.type_disk}
        </p>
        <div className={styles.unitPrice}><Price value={data.price_sale} size="sm" /> / шт.</div>
        {data.canceled && <p className={styles.excludedNote}>Не включён в заказ</p>}
      </div>
      <button
        type="button"
        className={styles.deleteButton}
        aria-label={`Удалить ${data.name} из корзины`}
        onClick={() => dispatch(delOneTypeProduct({ productType: data.product_type, id: data.id }))}
      >
        <Icon name="trash" size={18} />
      </button>
      <div className={styles.bottom}>
        <QuantityStepper
          value={data.amount}
          max={data.balance}
          label={data.name}
          onDecrease={() => dispatch(changeAmount({ type: data.product_type, id: data.id, isPlus: false }))}
          onIncrease={() => dispatch(changeAmount({ type: data.product_type, id: data.id, isPlus: true }))}
        />
        <div className={styles.linePrice} aria-label={`Сумма за ${data.name}`}>
          <Price value={data.price_sale * data.amount} size="lg" />
        </div>
      </div>
    </article>
  )
}

export const CartTyresCards: React.FC<{ data: selectedType & resultsTyresType }> = ({ data }) =>
  <CartProductCard data={data} />
