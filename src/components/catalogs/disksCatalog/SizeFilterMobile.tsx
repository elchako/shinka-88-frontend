import type React from "react"
import { disksAPISelector, selectSelector, selectsSelect, type disksAPI } from '../../pages/main/blocks/filters/filtersBlocks/filterBlock2Slice'
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import { useAppDispatch, useAppSelector } from "../../../app/hooks"

export const SizeFilterMobile: React.FC = () => {
    const selects = useAppSelector(selectSelector)
    const disksAPI = useAppSelector(disksAPISelector)

    const dispatch = useAppDispatch()
    return (
        <>
            {selects.map((item, index) => {
                let values = [...disksAPI[item.selectName.apiName as keyof disksAPI]]
                values.sort()
                return <div className={FiltersStyles.selectMobile} key={`${index} - ${item}`}>
                    <p>{item.selectName.displayName}</p>
                    {<select defaultValue='' key={`${index} - ${item}`}
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