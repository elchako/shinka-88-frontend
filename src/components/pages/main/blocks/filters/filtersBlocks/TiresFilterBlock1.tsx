import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks'
import { checkboxesNames } from '../../../../../../consts'
import { checkboxesSelect, getTyresParametrs, selectsSelect, prepareHomeSearch } from '../../../../../../app/slices/filters/tiresFiltersSlice'
import type { tiresResponseData } from '../../../../../../types/tires'
import { filterOptions } from '../../../../../../utils/catalogFilters'
import { Button } from '../../../../../common/Button'
import { Icon } from '../../../../../common/Icon'
import { TyreOptions } from '../../../../../common/TyreOptions'
import styles from './HomePicker.module.scss'

export const TiresFilterBlock1 = () => {
  const dispatch = useAppDispatch()
  const { tiresAPI, selects, checkboxes } = useAppSelector(state => state.tiresFilters)
  const navigate = useNavigate()
  useEffect(() => { dispatch(getTyresParametrs()) }, [dispatch])
  return (
    <form className={styles.mainWrapper} onSubmit={event => { event.preventDefault(); dispatch(prepareHomeSearch()); navigate('/tires') }}>
      <div className={styles.intro}><h2 className={styles.title}>Подбор шин по параметрам</h2><p className={styles.hint}>Размер указан на боковине шины</p></div>
      <div className={`${styles.selects} ${styles.tyreSelects}`}>{selects.map(item => {
        const key = item.selectName.apiName as keyof tiresResponseData
        const values = filterOptions(tiresAPI.response_data[key])
        const value = Array.isArray(item.value) ? item.value[0] || '' : item.value
        if (value && !values.includes(value)) values.unshift(value)
        return <div className={styles.select} key={key}>
          <label htmlFor={`home-tyre-${key}`}>{item.selectName.displayName}</label>
          <select id={`home-tyre-${key}`} value={value} onChange={event => dispatch(selectsSelect({ selectName: key, value: event.currentTarget.value, isOneChoice: true }))}>
            <option value="">{key === 'width' ? 'Любая' : 'Любой'}</option>
            {values.map(option => <option value={option} key={option}>{key === 'diameter' && !/^R/i.test(option) ? `R${option}` : option}</option>)}
          </select>
        </div>
      })}</div>
      <TyreOptions />
      <div className={styles.bottomBlock}>
        <div className={styles.checkboxes}>{checkboxes.slice(0, 2).map((item, index) => <label key={item.checkboxName} className={styles.check}>
          <input type="checkbox" checked={item.checked} disabled={item.value.length === 0} onChange={() => dispatch(checkboxesSelect(checkboxesNames[index]))} />{item.checkboxName}
        </label>)}</div>
        <Button type="submit" rightIcon={<Icon name="arrow" size={18} />}>Подобрать шины</Button>
      </div>
    </form>
  )
}
