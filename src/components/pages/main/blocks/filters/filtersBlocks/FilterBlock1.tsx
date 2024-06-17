import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import {
    seasonsSelectSelector, seasonsSelectOne, typesSelectSelector,
    selectsSelect,
    checkboxesSelectSelector,
    checkboxesSelect,
    tiresAPISelector,
    explanationToggle,
    getTyresParametrs,
    selectSelector,
    getTyresCards,
    resetFilters,
} from "./filterBlock1Slice"
import type { tiresAPI } from "./filterBlock1Slice"
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks"
import {
    selectsNames1, selectsNames1_2, filterButtons,
    tabsButtons, checkboxesNames, typeSelectsValues, typeSelectsText,
    links
} from '../../../../../../consts'
import explanation from '../../../../../../imgs/explanation.png'
import { MainFiltersButton } from "../MainFiltersButton"
import { ExplanationModal } from "./ExplanationModal"
import type { ITabsProps } from "../MainFilters"
import '../../../../../../common.scss'
import Checkbox from "react-custom-checkbox";
import checkedIcon from '../../../../../../imgs/checked.png'
import { useEffect } from "react"
import { unwrapResult } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"

export const FilterBlock1: React.FC<ITabsProps> = ({ isModalOpen, setIsModalOpen }) => {

    //выбор типа параметров
    const tiresAPI = useAppSelector(tiresAPISelector)
    const typeParametrsSelects = useAppSelector(typesSelectSelector)
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
            {/* подбор по авто или параметрам */}
            {/* <select defaultValue={typeSelectsValues[0]} onChange={e => dispatch(typesSelect(e.target.value))} className={FilterBlocksStyles.parametrs}>
                <option value={typeSelectsValues[0]}>{typeSelectsText[0]}</option>
                <option value={typeSelectsValues[1]}>{typeSelectsText[1]}</option>
            </select> */}

            {/* селекты фильтра */}
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
                    {/* <div>
                        <Checkbox
                            icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                            label={checkboxesNames[2]}
                            className='checkboxesInput'
                            labelClassName='checkboxesLabel'
                            checked={checkboxesSelects[2].value}
                            onChange={() => dispatch(checkboxesSelect(checkboxesNames[2]))}
                        />
                        <img src={explanation} alt="explanation" onClick={() => dispatch(explanationToggle(true))} />
                        <ExplanationModal />
                    </div> */}
                </div>

                {/* кнопка применения фильтра */}
                <MainFiltersButton handler={() => navigate(links[3].link)} title={tabsButtons[0]} />
            </div>
        </div>
    )
}