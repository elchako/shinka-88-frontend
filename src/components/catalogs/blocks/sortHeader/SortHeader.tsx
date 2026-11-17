import type React from 'react'
import { useAppDispatch } from '../../../../app/hooks'
import { sorts } from '../../../../consts'
import filterStyles from '../filters/FiltersStyles.module.scss'
import styles from './SortHeaderStyles.module.scss'

interface SortData {
  sortType: unknown
  sortTypeAction: any
  newDataReq: any
}

export const SortHeader: React.FC<{ sortData: SortData }> = ({ sortData }) => {
  const dispatch = useAppDispatch()
  return (
    <label className={`${filterStyles.field} ${styles.mainWrapper}`}>
      <span>Сортировка</span>
      <select value={String(sortData.sortType)}
        onChange={event => dispatch(sortData.sortTypeAction(event.currentTarget.value))}>
        {sorts.map(sort => <option key={sort} value={sort}>
          {sort === 'Дешевле' ? 'Сначала дешевле' : sort === 'Дороже' ? 'Сначала дороже' : sort}
        </option>)}
      </select>
    </label>
  )
}
