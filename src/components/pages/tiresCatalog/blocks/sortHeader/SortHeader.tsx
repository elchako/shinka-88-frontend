import type React from "react"
import SortHeaderStyles from "./SortHeaderStyles.module.scss"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { sortTypeSelector, sortTypeSelect } from "../../../main/blocks/filters/filtersBlocks/filterBlock1Slice"
import { sorts } from "../../../../../consts"


export const SortHeader: React.FC = () => {
    const sortType = useAppSelector(sortTypeSelector)
    const dispatch = useAppDispatch()
    console.log(sorts)
    let sortsRender = sorts.map((item, index) => {
        let style = null
        item === sortType 
        ? style = SortHeaderStyles.sortBy + ' ' + SortHeaderStyles.selected
        : style = SortHeaderStyles.sortBy
            return <div className={style} key={`${index} ${item}`} 
            onClick={() => dispatch(sortTypeSelect(item))}>{item}</div>
    })

    return (
        <div className={SortHeaderStyles.mainWrapper}>
            <div className={SortHeaderStyles.title}>СОРТИРОВКА</div>
            {sortsRender}
        </div>
    )
}