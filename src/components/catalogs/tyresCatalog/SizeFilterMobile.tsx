import type React from "react"
import type { tiresAPI } from '../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice'
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { selectSelector, selectsSelect, tiresAPISelector } from "../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice"


export const SizeFilterMobile: React.FC = () => {
    const selects = useAppSelector(selectSelector)
    const tiresAPI = useAppSelector(tiresAPISelector)

    const dispatch = useAppDispatch()
    return (
        <>
            {selects.map((item, index) => {
                let values = [...tiresAPI[item.selectName.apiName as keyof tiresAPI]]
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
                    </select>}
                </div>
            })}
        </>
    )
}