import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import { seasonsSelectSelecor, seasonsSelect } from "./filterBlock1Slice"
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks"
import { selectsNames1, filterButtons, tabs } from '../../../../../../consts'
import explanation from '../../../../../../imgs/explanation.png'
import { MainFiltersButton } from "../MainFiltersButton"
import { ExplanationModal } from "./ExplanationModal"
import type { ITabsProps } from "../MainFilters"
import '../../../../../../common.scss'
import Checkbox from "react-custom-checkbox";
import checkedIcon from '../../../../../../imgs/checked.png'

export const FilterBlock1: React.FC<ITabsProps> = ({ isModalOpen, setIsModalOpen }) => {
    // эти данные будут поступать с апи
    const select1 = [150, 155, 160, 165]
    const select2 = [45, 50, 55, 60]
    const select3 = [17, 18, 19, 20]
    const select4 = ['производитель 1', 'производитель 2', 'производитель 3', 'производитель 4',]
    const selects = [select1, select2, select3, select4]

    // выбор кнопок сезона
    const season = useAppSelector(seasonsSelectSelecor)
    const dispatch = useAppDispatch()

    return (
        <div className={FilterBlocksStyles.mainWrapper}>
            <div className={FilterBlocksStyles.selects}>
                {selectsNames1.map((item, index) => {
                    return <div className={FilterBlocksStyles.select} key={index}>
                        <p>{item}</p>
                        <select>
                            {selects[index].map(item => {
                                return <option value={item}>{item}</option>
                            })}
                        </select>
                    </div>
                })}
            </div>
            <div className={FilterBlocksStyles.filterButtons}>
                {filterButtons.map(item =>
                    <button className={season === item ? FilterBlocksStyles.selectedButton : ''}
                        onClick={() => dispatch(seasonsSelect(item))}>{item}</button>)}
            </div>
            <div className={FilterBlocksStyles.bottomBlock}>
                <div className={FilterBlocksStyles.checkboxes}>
                    <Checkbox
                        icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                        label="RunFlat"
                        className='checkboxesInput'
                        labelClassName='checkboxesLabel'
                    />
                    <Checkbox
                        icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                        label="Усиленные"
                        className='checkboxesInput'
                        labelClassName='checkboxesLabel'
                    />
                    <div>
                        <Checkbox
                            icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                            label="Бесплатный шиномонтаж"
                            className='checkboxesInput'
                            labelClassName='checkboxesLabel'
                        />
                        <img src={explanation} alt="explanation" onClick={() => setIsModalOpen(true)} />
                        <ExplanationModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                    </div>
                </div>
                <MainFiltersButton title={tabs[0]} />
            </div>
        </div>
    )
}