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
import { filteredTyresSelector as cardsData1, getTyresCards, sortTyresTypeSelect, sortTyresTypeSelector, type resultsType } from '../components/pages/main/blocks/filters/filtersBlocks/filterBlock1Slice'
import summer from '../imgs/tiresCard/summer.png'
import winter from '../imgs/tiresCard/winter.png'
import allSeasons from '../imgs/tiresCard/all-seasons.png'
import runflat from '../imgs/tiresCard/runflat.png'
import strong from '../imgs/tiresCard/strong.png'


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const useCatalogDataHook = (page: string) => {
    let title: string = 'Каталог шин'
    let filtersBlocks: React.FC<{}> = TyresFilterBlocks
    let filtersBlocksMobile: React.FC<{}> = TyresFilterBlocksMobileModal
    let selectSelector = cardsData1
    let sortTypeSelector = sortTyresTypeSelector
    let sortTypeAction = sortTyresTypeSelect
    let newDataReq = getTyresCards

    switch (page.slice(1)) {
        case links[4].link:
            title = 'Каталог дисков'
            filtersBlocks = DisksFilterBlocks
            filtersBlocksMobile = DisksFilterBlocksMobileModal
            selectSelector = cardsData1
            sortTypeSelector = sortTyresTypeSelector
            sortTypeAction = sortTyresTypeSelect
            newDataReq = getTyresCards
            break
    }
    const cardsData = useAppSelector(selectSelector)
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
        cardsData,
        sortData,
    }
}

export const useCardData = (data: resultsType) => {
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