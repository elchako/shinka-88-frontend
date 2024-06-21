import type React from "react"
import FiltersStyles from "./FiltersStyles.module.scss"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { mobileFiltersReducer } from "../../../common/slices/smallActions"
import { useEffect, useState } from "react"
import { priceEndSelector, priceStartSelector, selectSelector } from "../../../pages/main/blocks/filters/filtersBlocks/filterBlock2Slice"


export const MobileDisksFilters: React.FC = () => {
    const dispatch = useAppDispatch()
    const [filterCounter, setFilterCounter] = useState<number>(0)
    const stateSelects = useAppSelector(selectSelector)
    const statePriceStart = useAppSelector(priceStartSelector)
    const statePriceEnd = useAppSelector(priceEndSelector)

    useEffect(() => {
        let newCount = 0
        // селекты
        for (let i = 0; i < stateSelects.length; i++) {
            if (stateSelects[i].value.length !== 0) {
                newCount++
            }
        }
        // цена
        if (statePriceStart !== 0 || statePriceEnd !== 0) newCount++
        setFilterCounter(newCount)

    }, [dispatch, stateSelects, statePriceStart, statePriceEnd])
    return (
        <div onClick={() => dispatch(mobileFiltersReducer())} className={FiltersStyles.mainWrapperMobile}>
            <div className={FiltersStyles.mobileFilterImg}></div>
            <div className={FiltersStyles.mobileTitle}>Параметры</div>
            <div className={FiltersStyles.mobileFiltersCounter}>
                {filterCounter === 0 ? '' : filterCounter}</div>
        </div>
    )
}