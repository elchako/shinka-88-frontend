import type React from "react"
import { SizeFilter } from "./SizeFilter"
import { useEffect } from "react"
import { getDisksCards, priceEndSelector, priceStartSelector, selectSelector, sortDisksTypeSelect } from "../../pages/main/blocks/filters/filtersBlocks/filterBlock2Slice"
import { type IFilterBlockProps, useAppDispatch, useAppSelector } from "../../../app/hooks"
import { sorts } from "../../../consts"


export const DisksFilterBlocks: React.FC<IFilterBlockProps> = ({ parentRef }) => {
    const dispatch = useAppDispatch()
    const stateSelects = useAppSelector(selectSelector)
    const statePriceStart = useAppSelector(priceStartSelector)
    const statePriceEnd = useAppSelector(priceEndSelector)

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