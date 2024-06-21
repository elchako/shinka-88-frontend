import type React from "react"
import { SizeFilter } from "./SizeFilter"
import { SeasonFilter } from "./SeasonFilter"
import { AdditionalFilter } from "./AdditionalFilter"
import { type IFilterBlockProps, useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
    checkboxesSelectSelector, priceStartSelector, seasonsSelectSelector,
    getTyresCards, priceEndSelector, selectSelector, sortTyresTypeSelect
} from "../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice"
import { useEffect } from "react"
import { sorts } from "../../../consts"

export const TyresFilterBlocks: React.FC<IFilterBlockProps> = ({ parentRef }) => {
    const dispatch = useAppDispatch()
    const stateSelects = useAppSelector(selectSelector)
    const stateSeasons = useAppSelector(seasonsSelectSelector)
    const stateCheckboxes = useAppSelector(checkboxesSelectSelector)
    const statePriceStart = useAppSelector(priceStartSelector)
    const statePriceEnd = useAppSelector(priceEndSelector)
    useEffect(() => {
        dispatch(getTyresCards(true)).then(res => {
            dispatch(sortTyresTypeSelect(sorts[0]))
            if (parentRef.current) parentRef.current.scrollTop = 0
        })
    }, [dispatch, parentRef, stateSelects, stateSeasons, stateCheckboxes, statePriceStart, statePriceEnd])
    return (
        <>
            <SizeFilter />
            <SeasonFilter />
            <AdditionalFilter />
        </>
    )
}