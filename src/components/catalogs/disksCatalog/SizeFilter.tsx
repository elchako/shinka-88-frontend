import type React from "react"
import { disksAPISelector, getDisksParametrs, selectSelector, selectsSelect, type disksAPI } from '../../pages/main/blocks/filters/filtersBlocks/filterBlock2Slice'
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { useEffect } from "react"

export const SizeFilter: React.FC = () => {
    const selects = useAppSelector(selectSelector)
    const disksAPI = useAppSelector(disksAPISelector)

    const dispatch = useAppDispatch()

    useEffect(() => {
        let dataIsEmpty = true
        for (const key in disksAPI) {
            if (disksAPI[key as keyof disksAPI].length === 0) {
                dataIsEmpty = false
                break
            }
        }

        if (!dataIsEmpty) dispatch(getDisksParametrs(''))
    }, [dispatch, disksAPI])
    return (
        <div className={FiltersStyles.size}>
            <p className={FiltersStyles.filterTitle}>Размер</p>
            {selects.map((item, index) => {
                let values = [...disksAPI[item.selectName.apiName as keyof disksAPI]]
                values.sort()
                let defaultValue = ''
                if (item.value !== '' && item.value.length !== 0) {
                    typeof item.value === 'string' ? defaultValue = item.value : defaultValue = item.value[0]
                }
                return <select className={FiltersStyles.select} key={`${index} - ${item}`}
                    value={defaultValue}
                    onChange={e => dispatch(selectsSelect({
                        selectName: item.selectName.apiName,
                        value: e.currentTarget.value,
                        isOneChoice: true
                    }))}>
                    <option value='' disabled>{item.selectName.displayName}</option>
                    {values.map((item, index) => {
                        return <option key={`${index} - ${item}`} value={item as string}>{item}</option>
                    })}
                </select>
            })}
        </div>
    )
}