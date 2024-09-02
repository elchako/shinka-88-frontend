import type React from "react"
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
    disksAPISelector,
    selectSelector,
    selectsSelect
} from "../../../app/slices/filters/disksFiltersSlice"
import type { diskResponseData } from "../../../types/disks"


export const SizeFilterMobile: React.FC = () => {
    const dispatch = useAppDispatch()

    const selects = useAppSelector(selectSelector)
    const disksAPI = useAppSelector(disksAPISelector)

    return (
        <>
            {selects.map((item, index) => {
                let values = [...disksAPI[item.selectName.apiName as keyof diskResponseData]]
                values.sort()
                values.sort()
                let defaultValue = ''
                if (item.value !== '' && item.value.length !== 0) {
                    typeof item.value === 'string' ? defaultValue = item.value : defaultValue = item.value[0]
                }
                return <div className={FiltersStyles.selectMobile} key={`${index} - ${item}`}>
                    <p>{item.selectName.displayName}</p>
                    {<select value={defaultValue} key={`${index} - ${item}`}
                        onChange={e => dispatch(selectsSelect({
                            selectName: item.selectName.apiName,
                            value: e.currentTarget.value,
                            isOneChoice: true
                        }))}>
                        <option value='' disabled>-</option>
                        {values.map((item, index) => {
                            return <option key={`${index} - ${item}`} value={item as string}>{item}</option>
                        })}
                    </select>
                    }
                </div>
            })}
        </>
    )
}