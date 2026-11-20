import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { disksAPISelector, selectSelector, selectsSelect } from '../../../app/slices/filters/disksFiltersSlice'
import type { diskResponseData } from '../../../types/disks'
import { filterOptions } from '../../../utils/catalogFilters'
import { DiskTypeFilter } from '../../common/DiskTypeFilter'
import styles from '../blocks/filters/FiltersStyles.module.scss'

export const SizeFilter = () => {
  const dispatch = useAppDispatch()
  const selects = useAppSelector(selectSelector)
  const options = useAppSelector(disksAPISelector)
  return <>
    <fieldset className={styles.group}>
      <legend>Параметры диска</legend>
      {selects.filter(item => item.selectName.apiName !== 'type_disk').map(item => {
        const key = item.selectName.apiName as keyof diskResponseData
        const value = typeof item.value === 'string' ? item.value : item.value[0] || ''
        const values = filterOptions(options[key])
        if (value && !values.includes(value)) values.unshift(value)
        return <label className={styles.field} key={key}>
          <span>{item.selectName.displayName}</span>
          <select value={value} onChange={event => dispatch(selectsSelect({ selectName: key, value: event.currentTarget.value, isOneChoice: true }))}>
            <option value="">Любой</option>{values.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      })}
      <p className={styles.hint}>Ступица: диаметр центрального отверстия (DIA).</p>
    </fieldset>
    <DiskTypeFilter />
  </>
}
