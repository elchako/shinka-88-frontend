import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import { links, tabsButtons } from '../../../../../../consts'
import { MainFiltersButton } from "../MainFiltersButton"
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    disksAPISelector,
    getDisksParametrs,
    resetFilters,
    selectSelector,
    selectsSelect
} from "../../../../../../app/slices/filters/disksFiltersSlice"
import { type disksAPI } from "../../../../../../types/disks"

export const DisksFilterBlock2: React.FC = () => {
    const dispatch = useAppDispatch()
    const selects = useAppSelector(selectSelector)
    const disksAPI = useAppSelector(disksAPISelector)

    const navigate = useNavigate()

    useEffect(() => {
        // подгрузка данных для фильтров 
        // и сброс фильтров при переходе на страницу
        dispatch(getDisksParametrs(''))
        dispatch(resetFilters())
    }, [dispatch])

    return (
        <div className={FilterBlocksStyles.mainWrapper}>
            <div className={FilterBlocksStyles.selects}>
                {/* селекты */}
                {selects.map((item, index) => {
                    let values = [...disksAPI[item.selectName.apiName as keyof disksAPI]]
                    values.sort()
                    return <div className={FilterBlocksStyles.select} key={index}>
                        <p>{item.selectName.displayName}</p>
                        <select defaultValue='' key={`${index} - ${item}`}
                            onChange={e => dispatch(selectsSelect({
                                selectName: item.selectName.apiName,
                                value: e.currentTarget.value,
                                isOneChoice: true
                            }))}>
                            <option value='' disabled>-</option>
                            {values.map((item, index) => {
                                return <option key={`${item} - ${index}`} value={item as string}>{item}</option>
                            })}
                        </select>
                    </div>
                })}
            </div>
            <div className={FilterBlocksStyles.bottomBlock}>
                <div className={FilterBlocksStyles.checkboxes}>
                </div>

                {/* кнопка применения фильтра */}
                <MainFiltersButton handler={() => navigate(links[4].link)} title={tabsButtons[1]} />
            </div>
        </div>
    )
}