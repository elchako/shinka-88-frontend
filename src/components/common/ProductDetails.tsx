import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { resultsTyresType } from '../../types/tires'
import type { resultsDisksType } from '../../types/disks'
import { Modal } from './Modal'
import { Icon } from './Icon'
import { Price } from './Price'
import styles from './ProductDetails.module.scss'

type Product = resultsTyresType | resultsDisksType

export const ProductDetails = ({ product, isOpen, onClose }: { product: Product; isOpen: boolean; onClose: () => void }) => {
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const tyre = product.product_type === 'Шины' ? product as resultsTyresType : null
  const disk = product.product_type === 'Диски' ? product as resultsDisksType : null
  const fields: [string, string | null | undefined][] = [
    ['Категория', tyre ? 'Шины' : 'Диски'], ['Производитель', product.marka], ['Модель', product.model],
    ['Ширина', product.width], ['Диаметр', product.diameter],
    ...(tyre ? [['Высота', tyre.height], ['Сезон', tyre.seazon], ['Шипы', tyre.thorning], ['Индекс нагрузки', tyre.load], ['Индекс скорости', tyre.speed]] as [string, string][] : []),
    ...(disk ? [['Тип диска', disk.type_disk], ['Количество отверстий', disk.holesquant], ['PCD', disk.pcd], ['Вылет', disk.wheeloffset], ['DIA', disk.dia], ['Цвет', disk.color]] as [string, string][] : []),
  ]
  if (!isOpen || typeof document === 'undefined') return null
  return createPortal(<Modal isOpen={isOpen} onClose={onClose} title={product.name} size="xl" mobileFullscreen>
    <div className={styles.layout}>
      <div className={styles.photo}>
        {product.image_url?.trim() && failedImage !== product.image_url
          ? <img src={product.image_url} alt={product.name} onError={() => setFailedImage(product.image_url)} />
          : <div className={styles.noPhoto}><Icon name={tyre ? 'tire' : 'wheel'} size={48} /><span>Нет фото</span></div>}
      </div>
      <div className={styles.details}>
        <div className={styles.price}><Price value={product.price_sale} size="lg" /> / шт.</div>
        {Number.isFinite(product.balance) && <p>В наличии: {product.balance} шт.</p>}
        <dl>{fields.filter(([, value]) => typeof value === 'string' && value.trim() && value !== '_').map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </div>
    </div>
  </Modal>, document.body)
}
