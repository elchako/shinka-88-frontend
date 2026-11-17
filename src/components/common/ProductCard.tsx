import type React from "react"
import styles from "./ProductCard.module.scss"
import { Price } from "./Price"
import { Badge } from "./Badge"
import { Button } from "./Button"
import type { resultsTyresType } from "../../types/tires"
import type { resultsDisksType } from "../../types/disks"

// Icons
const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ShoppingCartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

type ProductType = (resultsTyresType | resultsDisksType) & { amount: number }

interface ProductCardProps {
  product: ProductType
  isInCart: boolean
  onAddToCart: () => void
  onQuantityChange: (increment: boolean) => void
  isLoading?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInCart,
  onAddToCart,
  onQuantityChange,
  isLoading = false,
}) => {
  const isTyre = 'seazon' in product
  const totalPrice = product.price_sale * product.amount

  // Проверяем, есть ли ещё товар на складе
  const canIncrease = product.amount < (product.balance || Infinity)

  return (
    <article className={styles.card} aria-busy={isLoading}>
      {/* Left side - Image and badges */}
      <div className={styles.imageSection}>
        <div className={styles.badges}>
          {isTyre && (
            <>
              <Badge 
                variant={product.seazon === 'лето' ? 'summer' : product.seazon === 'зима' ? 'winter' : 'default'}
              >
                {product.seazon}
              </Badge>
              {'runflat' in product && product.runflat && (
                <Badge variant="runflat">RunFlat</Badge>
              )}
              {'strong' in product && product.strong && (
                <Badge variant="strong">Усиленная</Badge>
              )}
            </>
          )}
        </div>
        <div className={styles.imageWrapper}>
          <img 
            src={product.image_url} 
            alt={product.name}
            loading="lazy"
            className={styles.image}
          />
        </div>
      </div>

      {/* Middle - Product info */}
      <div className={styles.infoSection}>
        <h3 className={styles.title}>{product.name}</h3>
        
        <div className={styles.specs}>
          {'width' in product && 'height' in product && (
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Размер:</span>
              <span className={styles.specValue}>{product.width}/{product.height}</span>
            </div>
          )}
          {isTyre && (
            <>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Сезон:</span>
                <span className={styles.specValue}>{product.seazon}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Марка:</span>
                <span className={styles.specValue}>{product.marka}</span>
              </div>
            </>
          )}
          {'diameter' in product && (
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Диаметр:</span>
              <span className={styles.specValue}>{product.diameter}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Price and actions */}
      <div className={styles.actionSection}>
        <div className={styles.priceBlock}>
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>Цена:</span>
            <Price value={product.price_sale} size="lg" />
          </div>
          
          <div className={styles.quantityRow}>
            <span className={styles.priceLabel}>Кол-во:</span>
            <div className={styles.quantityControl}>
              <button
                className={styles.quantityButton}
                onClick={() => onQuantityChange(false)}
                disabled={product.amount <= 1}
                aria-label="Уменьшить количество"
              >
                <MinusIcon />
              </button>
              <span className={styles.quantityValue} aria-live="polite">
                {product.amount}
              </span>
              <button
                className={styles.quantityButton}
                onClick={() => onQuantityChange(true)}
                disabled={!canIncrease}
                aria-label="Увеличить количество"
              >
                <PlusIcon />
              </button>
            </div>
          </div>

          <div className={styles.totalRow}>
            <span className={styles.priceLabel}>Итого:</span>
            <Price value={totalPrice} size="xl" variant="sale" />
          </div>
        </div>

        <Button
          variant={isInCart ? 'secondary' : 'primary'}
          size="lg"
          fullWidth
          onClick={onAddToCart}
          isLoading={isLoading}
          leftIcon={isInCart ? <CheckIcon /> : <ShoppingCartIcon />}
          aria-label={isInCart ? 'Перейти в корзину' : 'Добавить в корзину'}
        >
          {isInCart ? 'В корзине' : 'В корзину'}
        </Button>

        {product.balance !== undefined && product.balance < 10 && (
          <p className={styles.stockWarning}>
            Осталось {product.balance} шт.
          </p>
        )}
      </div>
    </article>
  )
}
