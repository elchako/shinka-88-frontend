import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import {
    seasonsSelectSelector, seasonsSelectOne, typesSelectSelector,
    typesSelect, selectSelector, selectsSelect,
    checkboxesSelectSelector,
    checkboxesSelect,
    tiresAPISelector,
    explanationToggle,
} from "./filterBlock1Slice"
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks"
import {
    selectsNames1, selectsNames1_2, filterButtons,
    tabsButtons, checkboxesNames, typeSelectsValues, typeSelectsText
} from '../../../../../../consts'
import explanation from '../../../../../../imgs/explanation.png'
import { MainFiltersButton } from "../MainFiltersButton"
import { ExplanationModal } from "./ExplanationModal"
import type { ITabsProps } from "../MainFilters"
import '../../../../../../common.scss'
import Checkbox from "react-custom-checkbox";
import checkedIcon from '../../../../../../imgs/checked.png'

export const FilterBlock1: React.FC<ITabsProps> = ({ isModalOpen, setIsModalOpen }) => {

    //выбор типа параметров
    const tires = useAppSelector(tiresAPISelector)
    const typeParametrsSelects = useAppSelector(typesSelectSelector)
    const selectsSelects = useAppSelector(selectSelector)
    const checkboxesSelects = useAppSelector(checkboxesSelectSelector)
    const season = useAppSelector(seasonsSelectSelector)
    let parametrsArr = null
    if (typeParametrsSelects === typeSelectsValues[0]) {
        parametrsArr = selectsNames1
    } else {
        parametrsArr = selectsNames1_2
    }

    const dispatch = useAppDispatch()
    //дефолтные значения для селектов
    
    return (
        <div className={FilterBlocksStyles.mainWrapper}>
            {/* подбор по авто или параметрам */}
            {/* <select defaultValue={typeSelectsValues[0]} onChange={e => dispatch(typesSelect(e.target.value))} className={FilterBlocksStyles.parametrs}>
                <option value={typeSelectsValues[0]}>{typeSelectsText[0]}</option>
                <option value={typeSelectsValues[1]}>{typeSelectsText[1]}</option>
            </select> */}
            {/* селекты фильтра */}
            <div className={FilterBlocksStyles.selects}>
                {parametrsArr.map((item, index) => {
                    return <div className={FilterBlocksStyles.select} key={`${index} - ${item}`}>
                        <p>{item}</p>
                        {tires[index] !== undefined
                            ? <select defaultValue={selectsSelects[index].value === ''
                                ? '-'
                                : selectsSelects[index].value} key={`${index} - ${item}`}
                                onChange={e => dispatch(selectsSelect({
                                    selectName: item,
                                    value: e.currentTarget.value,
                                    isMainPage: true
                                }))}>
                                <option value='-' disabled>-</option>
                                {tires[index].map(item => {
                                    if (selectsSelects[index].value === String(item.value)) {
                                        return <option value={item.value} >{item.name}</option>
                                    }
                                    return <option value={item.value}>{item.name}</option>
                                })}
                            </select>
                            : <input type="text" onChange={e => dispatch(selectsSelect({
                                selectName: item,
                                value: e.currentTarget.value,
                                isMainPage: true
                            }))} />
                        }
                    </div>
                })}
            </div>
            {/* выбор сезона */}
            <div className={FilterBlocksStyles.filterButtons}>
                {filterButtons.map((item, index) =>
                    <button key={`${index} - ${item}`} className={season[0] === item ? FilterBlocksStyles.selectedButton : ''}
                        onClick={() => dispatch(seasonsSelectOne(item))}>{item}</button>)}
            </div>
            <div className={FilterBlocksStyles.bottomBlock}>
                {/* доп. параметры */}
                <div className={FilterBlocksStyles.checkboxes}>
                    <Checkbox
                        icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                        label={checkboxesNames[0]}
                        className='checkboxesInput'
                        labelClassName='checkboxesLabel'
                        checked={checkboxesSelects[0].value}
                        onChange={() => dispatch(checkboxesSelect(checkboxesNames[0]))}
                    />
                    <Checkbox
                        icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                        label={checkboxesNames[1]}
                        className='checkboxesInput'
                        labelClassName='checkboxesLabel'
                        checked={checkboxesSelects[1].value}
                        onChange={() => dispatch(checkboxesSelect(checkboxesNames[1]))}
                    />
                    <div>
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
                    </div>
                </div>
                {/* кнопка применения фильтра */}
                <MainFiltersButton title={tabsButtons[0]} />
            </div>
        </div>
    )
}