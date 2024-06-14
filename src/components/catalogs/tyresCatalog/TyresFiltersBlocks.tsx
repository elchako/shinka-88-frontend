import type React from "react"
import { SizeFilter } from "./SizeFilter"
import { SeasonFilter } from "./SeasonFilter"
import { AdditionalFilter } from "./AdditionalFilter"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { getTyresCards, priceEndSelector, selectSelector, sortTyresTypeSelect } from "../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice"
import { checkboxesSelectSelector, priceStartSelector, seasonsSelectSelector } from "../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice"
import { useEffect } from "react"
import { sorts } from "../../../consts"


export const TyresFilterBlocks: React.FC = () => {
    const dispatch = useAppDispatch()
    const stateSelects = useAppSelector(selectSelector)
    const stateSeasons = useAppSelector(seasonsSelectSelector)
    const stateCheckboxes = useAppSelector(checkboxesSelectSelector)
    const statePriceStart = useAppSelector(priceStartSelector)
    const statePriceEnd = useAppSelector(priceEndSelector)

    useEffect(() => {
        dispatch(getTyresCards(true)).then(res => {
            dispatch(sortTyresTypeSelect(sorts[0]))
        })
    }, [dispatch, stateSelects, stateSeasons, stateCheckboxes, statePriceStart, statePriceEnd])
    return (
        <>
            <SizeFilter />
            <SeasonFilter />
            <AdditionalFilter />
        </>
    )
}