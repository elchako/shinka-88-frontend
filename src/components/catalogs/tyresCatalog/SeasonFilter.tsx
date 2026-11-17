import type React from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { seasonsSelectMany, seasonsSelectSelector } from '../../../app/slices/filters/tiresFiltersSlice'
import { filterButtons } from '../../../consts'
import styles from '../blocks/filters/FiltersStyles.module.scss'

export const SeasonFilter: React.FC = () => {
  const dispatch = useAppDispatch()
  const season = useAppSelector(seasonsSelectSelector)
  return (
    <fieldset className={styles.group}>
      <legend>Сезон</legend>
      {filterButtons.slice(1).map(item => (
        <label className={styles.check} key={item.name}>
          <input type="checkbox" checked={season.some(value => value.name === item.name)}
            onChange={() => dispatch(seasonsSelectMany(item))} />
          <span>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
        </label>
      ))}
    </fieldset>
  )
}
