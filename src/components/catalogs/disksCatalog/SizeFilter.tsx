import type React from "react"
import { disksAPISelector, selectSelector, selectsSelect, type disksAPI } from '../../pages/main/blocks/filters/filtersBlocks/filterBlock2Slice'
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import { useAppDispatch, useAppSelector } from "../../../app/hooks"

export const SizeFilter: React.FC = () => {
    const selects = useAppSelector(selectSelector)
    const disksAPI = useAppSelector(disksAPISelector)

    const dispatch = useAppDispatch()
    return (
        <div className={FiltersStyles.size}>
            <p className={FiltersStyles.filterTitle}>Размер</p>
            {selects.map((item, index) => {
                let values = [...disksAPI[item.selectName.apiName as keyof disksAPI]]
                values.sort()
                return <select className={FiltersStyles.select} defaultValue='' key={`${index} - ${item}`}
                    onChange={e => dispatch(selectsSelect({
                        selectName: item.selectName.apiName,
                        value: e.currentTarget.value,
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