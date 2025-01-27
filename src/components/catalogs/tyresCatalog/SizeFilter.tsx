import type React from "react"
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { useEffect } from "react"
import {
    getTyresParametrs,
    selectSelector,
    selectsSelect,
    tiresAPISelector
} from "../../../app/slices/filters/tiresFiltersSlice"
import type { tiresResponseData } from "../../../types/tires"


// селекты фильтр
export const SizeFilter: React.FC = () => {
    const dispatch = useAppDispatch()

    const selects = useAppSelector(selectSelector)
    const tiresAPI = useAppSelector(tiresAPISelector)

    // получаем данные для фильтров из API если данные в стейте пустые
    useEffect(() => {
        let dataIsEmpty = true
        for (const key in tiresAPI) {
            if (tiresAPI[key as keyof tiresResponseData].length === 0) {
                dataIsEmpty = false
                break
            }
        }
        if (!dataIsEmpty) dispatch(getTyresParametrs(''))
    }, [dispatch])

    return (
        <div className={FiltersStyles.size}>
            <p className={FiltersStyles.filterTitle}>Размер</p>
            {selects.map((item, index) => {
                let values = [...tiresAPI[item.selectName.apiName as keyof tiresResponseData]]
                values.sort()
                let defaultValue = ''
                if (item.value !== '' && item.value.length !== 0) {
                    typeof item.value === 'string' ? defaultValue = item.value : defaultValue = item.value[0]
                }
                return <select className={FiltersStyles.select}
                    key={`${index} - ${item.selectName.apiName}`}
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