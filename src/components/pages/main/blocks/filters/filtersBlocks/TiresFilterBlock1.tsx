import type React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks'
import { filterButtons, tabsButtons, checkboxesNames, links } from '../../../../../../consts'
import { checkboxesSelect, checkboxesSelectSelector, getTyresParametrs, resetFilters, seasonsSelectOne, seasonsSelectMany, seasonsSelectSelector, selectSelector, selectsSelect, tiresAPISelector } from '../../../../../../app/slices/filters/tiresFiltersSlice'
import type { tiresResponseData } from '../../../../../../types/tires'
import { Button } from '../../../../../common/Button'
import { Icon } from '../../../../../common/Icon'
import styles from './HomePicker.module.scss'

export const TiresFilterBlock1: React.FC = () => {
  const dispatch = useAppDispatch()
  const api = useAppSelector(tiresAPISelector)
  const selects = useAppSelector(selectSelector)
  const season = useAppSelector(seasonsSelectSelector)
  const checks = useAppSelector(checkboxesSelectSelector)
  const navigate = useNavigate()
  useEffect(() => { dispatch(getTyresParametrs()); dispatch(resetFilters()) }, [dispatch])
  const labels: Record<string, string> = { width: 'Ширина, мм', height: 'Профиль, %', diameter: 'Диаметр' }
  const sorter = new Intl.Collator('ru', { numeric: true })
  return (
    <form className={styles.mainWrapper} onSubmit={event => { event.preventDefault(); navigate(`/${links[3].link}`) }}>
      <div className={styles.intro}><h2 className={styles.title}>Подбор шин по параметрам</h2><p className={styles.hint}>Размер указан на боковине шины</p></div>
      <div className={styles.selects}>
        {selects.map(item => {
          const key = item.selectName.apiName as keyof tiresResponseData
          const sourceValues: Array<string | null> = api[key] || []
          const values = sourceValues.filter((value): value is string => typeof value === 'string').sort(sorter.compare)
          const value = Array.isArray(item.value) ? item.value[0] || '' : item.value
          return <div className={styles.select} key={key}><label htmlFor={`home-tyre-${key}`}>{labels[key] || item.selectName.displayName}</label><select id={`home-tyre-${key}`} value={value} onChange={event => dispatch(selectsSelect({ selectName: key, value: event.currentTarget.value, isOneChoice: true }))}><option value="">{key === 'width' ? 'Любая' : 'Любой'}</option>{values.map(v => <option value={v} key={v}>{key === 'diameter' && !/^R/i.test(v) ? `R${v}` : v}</option>)}</select></div>
        })}
      </div>
      <div className={styles.seasonRow}><span className={styles.seasonLabel}>Сезон</span><div className={styles.filterButtons} role="group" aria-label="Сезон шин">{filterButtons.map((item, index) => <button type="button" key={item.name} aria-pressed={index === 0 ? season.length === 0 || season[0]?.name === item.name : season[0]?.name === item.name} onClick={() => { if (index === 0) season.forEach(s => dispatch(seasonsSelectMany(s))); else dispatch(seasonsSelectOne(item)) }}>{['Все', 'Зима, шипы', 'Зима, без шипов', 'Лето'][index] || item.name}</button>)}</div></div>
      <div className={styles.bottomBlock}><div className={styles.checkboxes}>{checks.slice(0, 2).map((item, index) => <label key={item.checkboxName} className={styles.check}><input type="checkbox" checked={item.checked} disabled={item.value.length === 0} onChange={() => dispatch(checkboxesSelect(checkboxesNames[index]))} />{item.checkboxName}</label>)}</div><Button type="submit" rightIcon={<Icon name="arrow" size={18} />}>{tabsButtons[0]}</Button></div>
    </form>
  )
}
