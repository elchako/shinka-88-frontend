import type React from "react"
import { SizeFilter } from "./SizeFilter"
import { useEffect } from "react"
import { type IFilterBlockProps, useAppDispatch, useAppSelector } from "../../../app/hooks"
import { sorts } from "../../../consts"
import {
    getDisksCards,
    priceEndSelector,
    priceStartSelector,
    selectSelector,
    sortDisksTypeSelect
} from "../../../app/slices/filters/disksFiltersSlice"


export const DisksFilterBlocks: React.FC<IFilterBlockProps> = ({ parentRef }) => {
    const dispatch = useAppDispatch()
    const stateSelects = useAppSelector(selectSelector)
    const statePriceStart = useAppSelector(priceStartSelector)
    const statePriceEnd = useAppSelector(priceEndSelector)

    // запрос на сервер при изменении фильтров
    useEffect(() => {
        dispatch(getDisksCards(true)).then(res => {
            dispatch(sortDisksTypeSelect(sorts[0]))
            if (parentRef.current) parentRef.current.scrollTop = 0
        })
    }, [dispatch, parentRef, stateSelects, statePriceStart, statePriceEnd])
    return (
        <>
            <SizeFilter />
        </>
    )
}