import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks'
import { getDisksParametrs, selectsSelect, prepareHomeSearch } from '../../../../../../app/slices/filters/disksFiltersSlice'
import type { diskResponseData } from '../../../../../../types/disks'
import { filterOptions } from '../../../../../../utils/catalogFilters'
import { Button } from '../../../../../common/Button'
import { Icon } from '../../../../../common/Icon'
import { DiskTypeFilter } from '../../../../../common/DiskTypeFilter'
import styles from './HomePicker.module.scss'

export const DisksFilterBlock2 = () => {
  const dispatch = useAppDispatch()
  const { disksAPI, selects } = useAppSelector(state => state.disksFilters)
  const navigate = useNavigate()
  useEffect(() => { dispatch(getDisksParametrs()) }, [dispatch])
  return (
    <form className={styles.mainWrapper} onSubmit={event => { event.preventDefault(); dispatch(prepareHomeSearch()); navigate('/disks') }}>
      <div className={styles.intro}><h2 className={styles.title}>Подбор дисков по параметрам</h2><p className={styles.hint}>Ступица: диаметр центрального отверстия (DIA)</p></div>
      <div className={`${styles.selects} ${styles.diskSelects}`}>{selects.filter(item => item.selectName.apiName !== 'type_disk').map(item => {
        const key = item.selectName.apiName as keyof diskResponseData
        const values = filterOptions(disksAPI.response_data[key])
        const value = Array.isArray(item.value) ? item.value[0] || '' : item.value
        if (value && !values.includes(value)) values.unshift(value)
        return <div className={styles.select} key={key}>
          <label htmlFor={`home-disk-${key}`}>{item.selectName.displayName}</label>
          <select id={`home-disk-${key}`} value={value} onChange={event => dispatch(selectsSelect({ selectName: key, value: event.currentTarget.value, isOneChoice: true }))}>
            <option value="">Любой</option>{values.map(option => <option value={option} key={option}>{option}</option>)}
          </select>
        </div>
      })}</div>
      <div className={styles.bottomBlock}><DiskTypeFilter /><Button type="submit" rightIcon={<Icon name="arrow" size={18} />}>Подобрать диски</Button></div>
    </form>
  )
}
