// This file serves as a central hub for re-exporting pre-typed Redux hooks.
// These imports are restricted elsewhere to ensure consistent
// usage of typed hooks throughout the application.
// We disable the ESLint rule here because this is the designated place
// for importing and re-exporting the typed versions of hooks.
/* eslint-disable @typescript-eslint/no-restricted-imports */
import type React from 'react'
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "./store"
import { links } from "../consts"
import { TyresFilterBlocks } from '../components/catalogs/tyresCatalog/TyresFiltersBlocks'
import { TyresFilterBlocksMobileModal } from '../components/catalogs/tyresCatalog/TyresFiltersBlocksMobileModal'
import { DisksFilterBlocks } from '../components/catalogs/disksCatalog/DisksFiltersBlocks'
import { DisksFilterBlocksMobileModal } from '../components/catalogs/disksCatalog/DisksFiltersBlocksMobileModal'
import {
    filteredTyresSelector, getTyresCards, sortTyresTypeSelect, sortTyresTypeSelector,
    type tyresCards, type resultsTyresType,
    priceStartSelector as priceStart1,
    priceEndSelector as priceEnd1,
    setPrice as setPrice1,
    resetFilters as resetFilters1,
} from './slices/filters/tiresFiltersSlice'
import summer from '../imgs/tiresCard/summer.png'
import winter from '../imgs/tiresCard/winter.png'
import allSeasons from '../imgs/tiresCard/all-seasons.png'
import runflat from '../imgs/tiresCard/runflat.png'
import strong from '../imgs/tiresCard/strong.png'
import {
    type disksCards, filteredDisksSelector, getDisksCards,
    priceStartSelector as priceStart2,
    priceEndSelector as priceEnd2,
    setPrice as setPrice2,
    resetFilters as resetFilters2,
    sortDisksTypeSelect, sortDisksTypeSelector
} from './slices/filters/disksFiltersSlice'


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export interface IFilterBlockProps {
    parentRef: React.RefObject<HTMLDivElement>
}

export const useCatalogDataHook = (page: string) => {
    let title: string = 'Каталог шин'
    let filtersBlocks: React.FC<IFilterBlockProps> = TyresFilterBlocks
    let filtersBlocksMobile: React.FC<{}> = TyresFilterBlocksMobileModal
    let priceStart: any = priceStart1
    let priceEnd: any = priceEnd1
    let priceSetter: any = setPrice1
    let resetFiltersAction: any = resetFilters1
    let selectSelector: any = filteredTyresSelector
    let sortTypeSelector: any = sortTyresTypeSelector
    let sortTypeAction: any = sortTyresTypeSelect
    let newDataReq: any = getTyresCards

    switch (page.slice(1)) {
        case links[4].link:
            title = 'Каталог дисков'
            filtersBlocks = DisksFilterBlocks
            filtersBlocksMobile = DisksFilterBlocksMobileModal
            priceStart = priceStart2
            priceEnd = priceEnd2
            priceSetter = setPrice2
            resetFiltersAction = resetFilters2
            selectSelector = filteredDisksSelector
            sortTypeSelector = sortDisksTypeSelector
            sortTypeAction = sortDisksTypeSelect
            newDataReq = getDisksCards
            break
    }

    const priceStartNumber: number = useAppSelector(priceStart)
    const priceEndNumber: number = useAppSelector(priceEnd)

    let commonFilters = {
        resetFiltersAction,
        priceStartNumber,
        priceEndNumber,
        priceSetter,
    }

    const cardsData: tyresCards | disksCards = useAppSelector(selectSelector)
    const sortType = useAppSelector(sortTypeSelector)
    const sortData = {
        sortType,
        sortTypeAction,
        newDataReq
    }
    return {
        title,
        filtersBlocks,
        filtersBlocksMobile,
        commonFilters,
        cardsData,
        sortData,
    }
}

export const useTyresCardData = (data: resultsTyresType) => {
    const runflatText = data.runflat ? 'RunFlat' : ''
    const runflatIcon = data.runflat ? runflat : ''
    const strongText = data.powerload ? 'Усилинные' : ''
    const strongIcon = data.powerload ? strong : ''
    const seasonIcons = [{ icon: summer, name: 'Летняя' }, { icon: winter, name: 'Зимняя' },
    { icon: allSeasons, name: 'Всесезонная' }]
    let seasonIcon
    seasonIcons.forEach(element => {
        if (element.name === data.seazon) {
            seasonIcon = element.icon
        }
    })
    return {
        seasonIcon,
        runflatText,
        runflatIcon,
        strongText,
        strongIcon
    }
}