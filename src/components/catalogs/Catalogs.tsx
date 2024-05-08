import type React from "react"
import CatalogStyles from "./CatalogStyles.module.scss"
import '../../common.scss'
import { SortHeader } from "./blocks/sortHeader/SortHeader"
import { DesktopFilters } from "./blocks/filters/DesktopFilters"
import { CardDesktop } from "./blocks/card/CardDesktop"
import { SortHeaderMobile } from "./blocks/sortHeader/SortHeaderMobile"
import { MobileFilters } from "./blocks/filters/MobileFilters"
import { CardMobile } from "./blocks/card/CardMobile"
import { useLocation } from "react-router-dom"
import { useCatalogDataHook } from "../../app/hooks"


export const Catalogs: React.FC = () => {
    const { pathname } = useLocation()
    const catalogData = useCatalogDataHook(pathname)
    return (
        <div className={CatalogStyles.mainWrapper}>
            <p className="pageTitle">{catalogData.title}</p>
            <SortHeader />
            <div className={CatalogStyles.content}>
                <DesktopFilters filterBlocks={<catalogData.filtersBlocks />} />
                <div className={CatalogStyles.cards}>
                    {[...Array(10)].map((item, index) => {
                        return <CardDesktop key={`${item} - ${index}`} />
                    })}
                </div>
            </div>
            <div className={CatalogStyles.contentMobile}>
                <div className={CatalogStyles.sortFilter}>
                    <SortHeaderMobile />
                    <MobileFilters />
                </div>
                <div className={CatalogStyles.cardsMobile}>
                    {[...Array(10)].map((item, index) => {
                        return <CardMobile key={`${item} - ${index}`} />
                    })}
                </div>
            </div>
        </div>
    )
}