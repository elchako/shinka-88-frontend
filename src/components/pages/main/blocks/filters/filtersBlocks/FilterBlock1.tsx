import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks"
import {
    filterButtons, tabsButtons, checkboxesNames, links
} from '../../../../../../consts'
import { MainFiltersButton } from "../MainFiltersButton"
import '../../../../../../common.scss'
import Checkbox from "react-custom-checkbox";
import checkedIcon from '../../../../../../imgs/checked.png'
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    checkboxesSelect,
    checkboxesSelectSelector,
    getTyresParametrs,
    resetFilters,
    seasonsSelectOne,
    seasonsSelectSelector,
    selectSelector,
    selectsSelect,
    type tiresAPI,
    tiresAPISelector
} from "../../../../../../app/slices/filters/tiresFiltersSlice"

export const FilterBlock1: React.FC = () => {

    //выбор типа параметров
    const tiresAPI = useAppSelector(tiresAPISelector)
    const checkboxesSelects = useAppSelector(checkboxesSelectSelector)
    const selects = useAppSelector(selectSelector)
    const season = useAppSelector(seasonsSelectSelector)

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    //дефолтные значения для селектов

    useEffect(() => {
        dispatch(getTyresParametrs(''))
        dispatch(resetFilters())
    }, [dispatch])

    return (
        <div className={FilterBlocksStyles.mainWrapper}>
            <div className={FilterBlocksStyles.selects}>
                {selects.map((item, index) => {
                    let values = [...tiresAPI[item.selectName.apiName as keyof tiresAPI]]
                    values.sort()
                    return <div className={FilterBlocksStyles.select} key={`${index} - ${item}`}>
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

            {/* выбор сезона */}
            <div className={FilterBlocksStyles.filterButtons}>
                {filterButtons.map((item, index) =>
                    <button key={`${index} - ${item.name}`} className={season[0]?.name === item.name ? FilterBlocksStyles.selectedButton : ''}
                        onClick={() => dispatch(seasonsSelectOne(item))}>{item.name}</button>)}
            </div>

            <div className={FilterBlocksStyles.bottomBlock}>
                {/* доп. параметры */}
                <div className={FilterBlocksStyles.checkboxes}>
                    <Checkbox
                        icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                        label={checkboxesNames[0]}
                        className='checkboxesInput'
                        labelClassName='checkboxesLabel'
                        checked={checkboxesSelects[0].checked}
                        onChange={() => dispatch(checkboxesSelect(checkboxesNames[0]))}
                    />
                    <Checkbox
                        icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                        label={checkboxesNames[1]}
                        className='checkboxesInput'
                        labelClassName='checkboxesLabel'
                        checked={checkboxesSelects[1].checked}
                        onChange={() => dispatch(checkboxesSelect(checkboxesNames[1]))}
                    />
                </div>

                {/* кнопка применения фильтра */}
                <MainFiltersButton handler={() => navigate(links[3].link)} title={tabsButtons[0]} />
            </div>
        </div>
    )
}