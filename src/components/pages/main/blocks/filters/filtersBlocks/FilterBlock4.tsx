import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import { selectsNames3, tabs } from '../../../../../../consts'
import { MainFiltersButton } from "../MainFiltersButton"

export const FilterBlock4: React.FC = () => {
    // эти данные будут поступать с апи
    const select1 = [150, 155, 160, 165]
    const select2 = [45, 50, 55, 60]
    const select3 = [17, 18, 19, 20]
    const select4 = ['производитель 1', 'производитель 2', 'производитель 3', 'производитель 4',]
    const selects = [select1, select2, select3, select4]


    return (
        <div className={FilterBlocksStyles.mainWrapper}>
            <div className={FilterBlocksStyles.selects}>
                {selectsNames3.map((item, index) => {
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
            <div className={FilterBlocksStyles.bottomBlock + ' ' + FilterBlocksStyles.bottomBlockJustButton}>
                <MainFiltersButton title={tabs[3]} />
            </div>
        </div>
    )
}