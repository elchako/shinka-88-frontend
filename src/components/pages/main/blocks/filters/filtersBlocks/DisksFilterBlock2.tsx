import type React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks'
import { links, tabsButtons } from '../../../../../../consts'
import { disksAPISelector, getDisksParametrs, resetFilters, selectSelector, selectsSelect } from '../../../../../../app/slices/filters/disksFiltersSlice'
import type { diskResponseData } from '../../../../../../types/disks'
import { Button } from '../../../../../common/Button'
import { Icon } from '../../../../../common/Icon'
import styles from './HomePicker.module.scss'

export const DisksFilterBlock2: React.FC = () => {
  const dispatch = useAppDispatch()
  const api = useAppSelector(disksAPISelector)
  const selects = useAppSelector(selectSelector)
  const navigate = useNavigate()
  useEffect(() => { dispatch(getDisksParametrs()); dispatch(resetFilters()) }, [dispatch])
  const labels: Record<string, string> = { diameter: 'Диаметр, дюймы', pcd: 'Крепление, PCD', type_disk: 'Тип диска' }
  const sorter = new Intl.Collator('ru', { numeric: true })
  return (
    <form className={styles.mainWrapper} onSubmit={event => { event.preventDefault(); navigate(`/${links[4].link}`) }}>
      <div className={styles.intro}><h1 className={styles.title}>Подбор дисков по параметрам</h1><p className={styles.hint}>Проверьте параметры крепления диска</p></div>
      <div className={styles.selects}>{selects.map(item => {
        const key = item.selectName.apiName as keyof diskResponseData
        const sourceValues: Array<string | null> = api[key] || []
        const values = sourceValues.filter((value): value is string => typeof value === 'string').sort(sorter.compare)
        const value = Array.isArray(item.value) ? item.value[0] || '' : item.value
        return <div className={styles.select} key={key}><label htmlFor={`home-disk-${key}`}>{labels[key] || item.selectName.displayName}</label><select id={`home-disk-${key}`} value={value} onChange={event => dispatch(selectsSelect({ selectName: key, value: event.currentTarget.value, isOneChoice: true }))}><option value="">{key === 'pcd' ? 'Любое' : 'Любой'}</option>{values.map(v => <option value={v} key={v}>{v}</option>)}</select></div>
      })}</div>
      <div className={`${styles.bottomBlock} ${styles.bottomBlockJustButton}`}><Button type="submit" rightIcon={<Icon name="arrow" size={18} />}>{tabsButtons[1]}</Button></div>
    </form>
  )
}
