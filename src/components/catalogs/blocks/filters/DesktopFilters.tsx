import type React from 'react'
import type { ReactElement } from 'react'
import { useAppDispatch } from '../../../../app/hooks'
import { Button } from '../../../common/Button'
import { Icon } from '../../../common/Icon'
import styles from './FiltersStyles.module.scss'

export interface CommonCatalogFilters {
  resetFiltersAction: any
  priceStartNumber: number
  priceEndNumber: number
  priceMinNumber: number | null
  priceMaxNumber: number | null
  priceSetter: any
}

export const CatalogPriceFields: React.FC<{ commonFilters: CommonCatalogFilters }> = ({ commonFilters }) => {
  const dispatch = useAppDispatch()
  return (
    <fieldset className={styles.group}>
      <legend>Цена за штуку, ₽</legend>
      <div className={styles.priceFields}>
        <label className={styles.field}>
          <span>От, ₽</span>
          <input type="number" min="0" step="any" inputMode="decimal"
            placeholder={commonFilters.priceMinNumber == null ? 'От' : String(commonFilters.priceMinNumber)}
            value={commonFilters.priceStartNumber === 0 ? '' : commonFilters.priceStartNumber}
            onChange={event => dispatch(commonFilters.priceSetter({
              number: Number(event.currentTarget.value), isStartOrEnd: true,
            }))} />
        </label>
        <label className={styles.field}>
          <span>До, ₽</span>
          <input type="number" min="0" step="any" inputMode="decimal"
            placeholder={commonFilters.priceMaxNumber == null ? 'До' : String(commonFilters.priceMaxNumber)}
            value={commonFilters.priceEndNumber === 0 ? '' : commonFilters.priceEndNumber}
            onChange={event => dispatch(commonFilters.priceSetter({
              number: Number(event.currentTarget.value), isStartOrEnd: false,
            }))} />
        </label>
      </div>
    </fieldset>
  )
}

export const DesktopFilters: React.FC<{
  filterBlocks: ReactElement
  commonFilters: CommonCatalogFilters
}> = ({ filterBlocks, commonFilters }) => {
  const dispatch = useAppDispatch()
  return (
    <aside className={styles.mainWrapper} aria-label="Параметры каталога">
      <div className={styles.filterHeader}><h2>Параметры</h2><Icon name="filter" size={19} /></div>
      <div className={styles.filters}>
        {filterBlocks}
        <CatalogPriceFields commonFilters={commonFilters} />
        <Button variant="outline" fullWidth onClick={() => dispatch(commonFilters.resetFiltersAction())}>
          Сбросить параметры
        </Button>
      </div>
    </aside>
  )
}
