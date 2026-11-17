import type React from 'react'
import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector, useCatalogDataHook } from '../../../../app/hooks'
import { mobileFiltersReducer, mobileFiltersSelector } from '../../../../app/slices/common/smallActions'
import { getDisksParametrs } from '../../../../app/slices/filters/disksFiltersSlice'
import { getTyresParametrs } from '../../../../app/slices/filters/tiresFiltersSlice'
import { Button } from '../../../common/Button'
import { Modal } from '../../../common/Modal'
import { CatalogPriceFields } from './DesktopFilters'
import styles from './FiltersStyles.module.scss'

export const MobileFiltersModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const isClosed = useAppSelector(mobileFiltersSelector)
  const { pathname } = useLocation()
  const catalog = useCatalogDataHook(pathname)
  const isDisks = pathname === '/disks'
  const filtersStatus = useAppSelector(state => isDisks
    ? state.disksFilters.filtersStatus : state.tiresFilters.filtersStatus)
  const close = useCallback(() => { dispatch(mobileFiltersReducer()) }, [dispatch])

  return (
    <Modal isOpen={!isClosed} onClose={close} title={isDisks ? 'Параметры дисков' : 'Параметры шин'} size="md"
      footer={
        <div className={styles.modalActions}>
          <Button variant="outline" onClick={() => dispatch(catalog.commonFilters.resetFiltersAction())}>Сбросить</Button>
          <Button onClick={close}>Показать товары</Button>
        </div>
      }>
      <div className={styles.modalFilters}>
        {filtersStatus === 'loading' && <p role="status" className={styles.feedback}>Загружаем параметры…</p>}
        {filtersStatus === 'failed' && <div role="alert" className={styles.feedback}>
          <p>Не удалось загрузить параметры.</p>
          <Button variant="outline" onClick={() => {
            if (isDisks) dispatch(getDisksParametrs())
            else dispatch(getTyresParametrs())
          }}>Повторить</Button>
        </div>}
        <catalog.filtersBlocksMobile />
        <CatalogPriceFields commonFilters={{ ...catalog.commonFilters,
          priceMinNumber: filtersStatus === 'succeeded' ? catalog.commonFilters.priceMinNumber : null,
          priceMaxNumber: filtersStatus === 'succeeded' ? catalog.commonFilters.priceMaxNumber : null,
        }} />
      </div>
    </Modal>
  )
}
