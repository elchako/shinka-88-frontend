import type React from "react"
import SortHeaderStyles from "./SortHeaderStyles.module.scss"
import { useAppDispatch } from "../../../../app/hooks"
import { sorts } from "../../../../consts"
import { useEffect } from "react"


interface IProps {
    sortData: { sortType: unknown; sortTypeAction: any; newDataReq: any; }
}

export const SortHeader: React.FC<IProps> = ({ sortData }) => {
    const sortType = sortData.sortType
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(sortData.newDataReq(true))
    }, [dispatch, sortType])

    let sortsRender = sorts.map((item, index) => {
        let style = null
        item === sortType
            ? style = SortHeaderStyles.sortBy + ' ' + SortHeaderStyles.selected
            : style = SortHeaderStyles.sortBy
        return <div className={style} key={`${index} ${item}`}
            onClick={() => dispatch(sortData.sortTypeAction(item))}>{item}</div>
    })

    return (
        <div className={SortHeaderStyles.mainWrapper}>
            <div className={SortHeaderStyles.title}>СОРТИРОВКА</div>
            {sortsRender}
        </div>
    )
}