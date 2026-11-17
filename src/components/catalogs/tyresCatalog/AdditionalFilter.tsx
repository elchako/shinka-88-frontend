import type React from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { checkboxesSelect, checkboxesSelectSelector } from '../../../app/slices/filters/tiresFiltersSlice'
import styles from '../blocks/filters/FiltersStyles.module.scss'

export const AdditionalFilter: React.FC = () => {
  const dispatch = useAppDispatch()
  const checkboxes = useAppSelector(checkboxesSelectSelector)
  return (
    <fieldset className={styles.group}>
      <legend>Особенности</legend>
      {checkboxes.slice(0, 2).map(item => (
        <label className={styles.check} key={item.checkboxName}>
          <input type="checkbox" checked={item.checked}
            onChange={() => dispatch(checkboxesSelect(item.checkboxName))} />
          <span>{item.checkboxName}</span>
        </label>
      ))}
    </fieldset>
  )
}
