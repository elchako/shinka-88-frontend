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

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const useCatalogDataHook = (page: string) => {
    let title: string = 'Каталог шин'
    let filtersBlocks: React.FC<{}> = TyresFilterBlocks
    let filtersBlocksMobile: React.FC<{}> = TyresFilterBlocksMobileModal

    switch (page.slice(1)) {
        case links[4].link:
            title = 'Каталог дисков'
            filtersBlocks = DisksFilterBlocks
            filtersBlocksMobile = DisksFilterBlocksMobileModal
            break
    }

    return {
        title,
        filtersBlocks,
        filtersBlocksMobile
    }
}