import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import { links, tabsButtons } from '../../../../../../consts'
import { MainFiltersButton } from "../MainFiltersButton"
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    type disksAPI,
    disksAPISelector,
    getDisksParametrs,
    selectSelector,
    selectsSelect
} from "../../../../../../app/slices/filters/disksFiltersSlice"

export const FilterBlock2: React.FC = () => {
    const selects = useAppSelector(selectSelector)
    const disksAPI = useAppSelector(disksAPISelector)

    const navigate = useNavigate()
    const dispatch = useAppDispatch()


    useEffect(() => {
        dispatch(getDisksParametrs(''))
    }, [dispatch])

    return (
        <div className={FilterBlocksStyles.mainWrapper}>
            <div className={FilterBlocksStyles.selects}>
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
                <MainFiltersButton handler={() => navigate(links[4].link)} title={tabsButtons[1]} />
            </div>
        </div>
    )
}