import type React from 'react'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { mobileFiltersReducer } from '../../../../app/slices/common/smallActions'
import { Button } from '../../../common/Button'
import { Icon } from '../../../common/Icon'
import styles from './FiltersStyles.module.scss'

export const MobileTyresFilters: React.FC = () => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(state => state.tiresFilters)
  const count = filters.selects.filter(item => item.value.length > 0).length
    + (filters.season !== 'all' ? 1 : 0)
    + (filters.studding !== 'all' ? 1 : 0)
    + filters.checkboxes.slice(0, 2).filter(item => item.checked).length
    + (filters.priceStart !== 0 || filters.priceEnd !== 0 ? 1 : 0)
  return (
    <Button variant="outline" className={styles.mobileTrigger} leftIcon={<Icon name="filter" size={17} />}
      aria-haspopup="dialog" onClick={() => dispatch(mobileFiltersReducer())}>
      Фильтры{count > 0 && <span className={styles.counter}>{count}</span>}
    </Button>
  )
}
