import type React from 'react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { amountHandler as tyreAmount } from '../../../../app/slices/filters/tiresFiltersSlice'
import { amountHandler as diskAmount } from '../../../../app/slices/filters/disksFiltersSlice'
import type { resultsTyresType } from '../../../../types/tires'
import type { resultsDisksType } from '../../../../types/disks'
import { Button } from '../../../common/Button'
import { Icon } from '../../../common/Icon'
import { Price } from '../../../common/Price'
import { QuantityStepper } from '../../../common/QuantityStepper'
import { ProductDetails } from '../../../common/ProductDetails'
import { hasProductFeature } from '../../../../utils/other'
import styles from './CardDesktopStyles.module.scss'

type Product = resultsTyresType | resultsDisksType
interface Props {
  data: Product
  category: 'tires' | 'disks'
  onAdd: (quantity: number, inCart: boolean) => void
}

export const ProductCard: React.FC<Props> = ({ data, category, onAdd }) => {
  const dispatch = useAppDispatch()
  const cart = useAppSelector(state => category === 'tires' ? state.cart.tyres : state.cart.disks)
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const quantity = Math.min(Math.max(0, data.balance), Math.max(1, data.amount || 1))
  const inCart = cart.some(item => item.id === data.id && item.amount === quantity && !item.canceled)
  const tyre = 'seazon' in data ? data : null
  const disk = 'type_disk' in data ? data : null
  const diameter = tyre ? (/^r/i.test(tyre.diameter) ? tyre.diameter : `R${tyre.diameter}`) : ''
  const pcd = disk ? (/[x×]/i.test(disk.pcd) || !disk.holesquant ? disk.pcd : `${disk.holesquant}×${disk.pcd}`) : ''
  const imageAvailable = Boolean(data.image_url?.trim() && failedImage !== data.image_url)

  return (
    <article className={styles.mainWrapper} aria-label={data.name}>
      <button type="button" className={styles.productPicture} onClick={() => setDetailsOpen(true)} aria-label={`Подробнее о товаре ${data.name}`}>
        {imageAvailable
          ? <img src={data.image_url} alt={data.name} loading="lazy" onError={() => setFailedImage(data.image_url)} />
          : <div className={styles.noImage} role="img" aria-label={`Нет изображения: ${data.name}`}>
            <Icon name={tyre ? 'tire' : 'wheel'} size={40} /><span>Нет фото</span>
          </div>}
      </button>
      <div className={styles.productBody}>
        <h2 className={styles.productTitle}><button type="button" className={styles.detailsTrigger} onClick={() => setDetailsOpen(true)}>{data.name}</button></h2>
        {tyre && <p className={styles.productSize}>{tyre.width}/{tyre.height} {diameter} {tyre.load}{tyre.speed}</p>}
        {disk && <p className={styles.productSize}>{disk.width ? `${disk.width}×` : ''}{disk.diameter}</p>}
        <div className={styles.productSpecs}>
          {tyre?.seazon && <span className={styles.badge}>
            <Icon name={tyre.seazon.toLowerCase().includes('зим') ? 'snow' : 'sun'} size={14} />
            {tyre.seazon}{tyre.seazon === 'Зимняя' && tyre.thorning === 'Ш.' ? ', шипы' : ''}
            {tyre.seazon === 'Зимняя' && ['_', 'н/ш.'].includes(tyre.thorning) ? ', без шипов' : ''}
          </span>}
          {tyre && hasProductFeature(tyre.runflat) && <span className={styles.badge}>RunFlat</span>}
          {tyre && hasProductFeature(tyre.powerload) && <span className={styles.badge}>Усиленные</span>}
          {disk?.type_disk && <span className={styles.badge}>{disk.type_disk}</span>}
        </div>
        {disk && <p className={styles.characteristics}>
          {[
            pcd ? `PCD ${pcd}` : '',
            disk.wheeloffset ? `ET ${disk.wheeloffset}` : '',
            disk.dia ? `DIA ${disk.dia}` : '',
          ].filter(Boolean).join(' · ')}
        </p>}
      </div>
      <div className={styles.productBuy}>
        <div className={styles.unitPrice}><Price value={data.price_sale} size="lg" /><span>/ шт.</span></div>
        <QuantityStepper value={quantity} min={data.balance > 0 ? 1 : 0} max={Math.max(0, data.balance)} label={data.name}
          className={styles.quantity}
          onDecrease={() => dispatch((category === 'tires' ? tyreAmount : diskAmount)({ id: data.id, isPlus: false }))}
          onIncrease={() => dispatch((category === 'tires' ? tyreAmount : diskAmount)({ id: data.id, isPlus: true }))} />
        <Button variant={inCart ? 'outline' : 'primary'} fullWidth className={inCart ? styles.inCart : styles.buyButton}
          disabled={quantity < 1} rightIcon={<Icon name={inCart ? 'check' : 'cart'} size={17} />}
          onClick={() => onAdd(quantity, inCart)}>{inCart ? 'В корзине' : 'В корзину'}</Button>
        <p className={styles.rowTotal}>{quantity} шт. × <Price value={data.price_sale} size="sm" /> = <Price value={data.price_sale * quantity} size="sm" /></p>
      </div>
      <ProductDetails product={data} isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </article>
  )
}
