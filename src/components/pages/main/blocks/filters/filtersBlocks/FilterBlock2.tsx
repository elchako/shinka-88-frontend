import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import { selectsNames2, tabsButtons } from '../../../../../../consts'
import explanation from '../../../../../../imgs/explanation.png'
import { MainFiltersButton } from "../MainFiltersButton"
import { ExplanationModal } from "./ExplanationModal"
import type { ITabsProps } from "../MainFilters"
import Checkbox from "react-custom-checkbox";
import checkedIcon from '../../../../../../imgs/checked.png'

export const FilterBlock2: React.FC<ITabsProps> = ({ isModalOpen, setIsModalOpen }) => {
    // эти данные будут поступать с апи
    const select1 = [150, 155, 160, 165]
    const select2 = [45, 50, 55, 60]
    const select3 = [17, 18, 19, 20]
    const select4 = ['производитель 1', 'производитель 2', 'производитель 3', 'производитель 4',]
    const selects = [select1, select2, select3, select4]


    return (
        <div className={FilterBlocksStyles.mainWrapper}>
            <div className={FilterBlocksStyles.selects}>
                {selectsNames2.map((item, index) => {
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
            <div className={FilterBlocksStyles.bottomBlock}>
                <div className={FilterBlocksStyles.checkboxes}>
                    <div className={FilterBlocksStyles.checkboxesMinHeight}>
                        <Checkbox
                            icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                            label="Бесплатный шиномонтаж"
                            className='checkboxesInput'
                            labelClassName='checkboxesLabel'
                        />
                        <img src={explanation} alt="explanation" onClick={() => setIsModalOpen(true)} />
                        <ExplanationModal />
                    </div>
                </div>
                <MainFiltersButton title={tabsButtons[1]} />
            </div>
        </div>
    )
}