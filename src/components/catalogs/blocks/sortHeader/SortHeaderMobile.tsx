import type React from "react"
import SortHeaderStyles from "./SortHeaderStyles.module.scss"
import { useState } from "react"
import { sorts } from "../../../../consts"
import { useAppSelector } from "../../../../app/hooks"
import { sortTyresTypeSelector } from "../../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice"


export const SortHeaderMobile: React.FC = () => {
    const sortType = useAppSelector(sortTyresTypeSelector)
    let newSorts = [...sorts]
    newSorts.splice(sorts.indexOf(sortType), 1)
    newSorts.unshift(sortType)

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleClick = (type: string) => {
        setIsOpen(!isOpen)
    }
    const styles = isOpen
        ? SortHeaderStyles.mainWrapperMobile + ' ' + SortHeaderStyles.sortsOpen
        : SortHeaderStyles.mainWrapperMobile
    return (
        <div className={styles}>
            <div className={SortHeaderStyles.sortImg}>&#8646;</div>
            <div className={SortHeaderStyles.sorts}>
                {newSorts.map((item, index) => {
                    return <p className={SortHeaderStyles.sortsItem} key={`${index} ${item}`}
                        onClick={() => handleClick(item)}>{item}</p>
                })}
            </div>
        </div>
    )
}