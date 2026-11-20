import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setSeason, setStudding } from '../../app/slices/filters/tiresFiltersSlice'
import { tyreSeasonOptions, tyreStuddingOptions } from '../../utils/catalogFilters'
import styles from './FilterChoices.module.scss'

export const TyreOptions = ({ compact = false }: { compact?: boolean }) => {
  const dispatch = useAppDispatch()
  const { season, studding } = useAppSelector(state => state.tiresFilters)
  return (
    <div className={`${styles.options} ${compact ? styles.compact : ''}`}>
      <fieldset className={styles.group} aria-label="Сезон шин">
        <legend>Сезон</legend>
        <div className={styles.buttons}>{tyreSeasonOptions.map(item => (
          <button type="button" key={item.value} aria-pressed={season === item.value} onClick={() => dispatch(setSeason(item.value))}>{item.label}</button>
        ))}</div>
      </fieldset>
      <fieldset className={styles.group} aria-label="Шипы">
        <legend>Шипы</legend>
        <div className={styles.buttons}>{tyreStuddingOptions.map(item => (
          <button type="button" key={item.value} aria-pressed={studding === item.value} onClick={() => dispatch(setStudding(item.value))}>{item.label}</button>
        ))}</div>
      </fieldset>
    </div>
  )
}
