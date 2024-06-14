import type React from "react"
import SortHeaderStyles from "./SortHeaderStyles.module.scss"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { sorts } from "../../../../consts"
import { sortTyresTypeSelect, sortTyresTypeSelector } from "../../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice"
import { useEffect } from "react"
import { type ActionCreatorWithPayload, type AsyncThunk } from "@reduxjs/toolkit"


interface IProps {
    sortData: {
        sortType: string;
        sortTypeAction: ActionCreatorWithPayload<string>
        newDataReq: AsyncThunk<{ response: any; refresh: any; }, any, any>
    }
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