import type React from "react"
import type { tiresAPI } from '../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice'
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { selectSelector, selectsSelect, tiresAPISelector } from "../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice"


export const SizeFilter: React.FC = () => {
    const selects = useAppSelector(selectSelector)
    const tiresAPI = useAppSelector(tiresAPISelector)

    const dispatch = useAppDispatch()
    return (
        <div className={FiltersStyles.size}>
            <p className={FiltersStyles.filterTitle}>Размер</p>
            {selects.map((item, index) => {
                let values = [...tiresAPI[item.selectName.apiName as keyof tiresAPI]]
                values.sort()
                return <select className={FiltersStyles.select} key={`${index} - ${item}`}
                    defaultValue=''
                    onChange={e => dispatch(selectsSelect({
                        selectName: item.selectName.apiName,
                        value: e.currentTarget.value,
                        isOneChoice: true
                    }))}>
                    <option value='' disabled>{item.selectName.displayName}</option>
                    {values.map(item => {
                        return <option value={item as string}>{item}</option>
                    })}
                </select>
            })}
        </div>
    )
}