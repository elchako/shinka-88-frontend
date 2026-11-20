import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setDiskType } from '../../app/slices/filters/disksFiltersSlice'
import { classifyDiskType, diskTypeOptions, filterOptions } from '../../utils/catalogFilters'
import styles from './FilterChoices.module.scss'

export const DiskTypeFilter = () => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(state => state.disksFilters)
  const chosen = filters.selects.find(item => item.selectName.apiName === 'type_disk')?.value || []
  const selected = typeof chosen === 'string' ? [chosen] : chosen
  const values = filterOptions(filters.disksAPI.response_data.type_disk)
  return (
    <fieldset className={styles.group} aria-label="Тип диска">
      <legend>Тип диска</legend>
      <div className={styles.buttons}>{diskTypeOptions.map(item => {
        const matching = values.filter(value => classifyDiskType(value) === item.value)
        const pressed = item.value === 'all' ? selected.length === 0 : selected.length > 0 && selected.every(value => classifyDiskType(value) === item.value)
        const disabled = item.value !== 'all' && matching.length === 0
        return <button type="button" key={item.value} aria-pressed={pressed} disabled={disabled}
          title={disabled ? 'Сейчас таких дисков нет в доступном каталоге' : undefined}
          onClick={() => dispatch(setDiskType(item.value === 'all' ? [] : matching))}>{item.label}</button>
      })}</div>
    </fieldset>
  )
}
