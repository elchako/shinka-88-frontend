import type React from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectSelector, selectsSelect, tiresAPISelector } from '../../../app/slices/filters/tiresFiltersSlice'
import type { tiresResponseData } from '../../../types/tires'
import styles from '../blocks/filters/FiltersStyles.module.scss'

export const SizeFilter: React.FC = () => {
  const dispatch = useAppDispatch()
  const selects = useAppSelector(selectSelector)
  const options = useAppSelector(tiresAPISelector)
  const labels: Record<string, string> = { width: 'Ширина, мм', height: 'Высота профиля, %', diameter: 'Диаметр', marka: 'Производитель' }

  return (
    <fieldset className={styles.group}>
      <legend>Размер</legend>
      {selects.map(item => {
        const value = typeof item.value === 'string' ? item.value : item.value[0] || ''
        const source: Array<string | null> = options[item.selectName.apiName as keyof tiresResponseData]
        const values = [...new Set(source.filter((option): option is string => typeof option === 'string' && option !== ''))]
          .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }))
        if (value && !values.includes(value)) values.unshift(value)
        return (
          <label className={styles.field} key={item.selectName.apiName}>
            <span>{labels[item.selectName.apiName] || item.selectName.displayName}</span>
            <select value={value} onChange={event => dispatch(selectsSelect({
              selectName: item.selectName.apiName, value: event.currentTarget.value, isOneChoice: true,
            }))}>
              <option value="">{item.selectName.apiName === 'width' ? 'Любая' : 'Любой'}</option>
              {values.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        )
      })}
    </fieldset>
  )
}
