import type React from "react"
import TiresCatalogStyles from "./TiresCatalogStyles.module.scss"
import '../../../common.scss'
import { SortHeader } from "./blocks/sortHeader/SortHeader"
import { DesktopTiresFilters } from "./blocks/filters/DesktopTiresFilters"
import { TiresCardDesktop } from "./blocks/card/TiresCardDesktop"
import { SortHeaderMobile } from "./blocks/sortHeader/SortHeaderMobile"
import { MobileTiresFilters } from "./blocks/filters/MobileTiresFilters"
import { TiresCardMobile } from "./blocks/card/TiresCardMobile"


export const TiresCatalog: React.FC = () => {
    return (
        <div className={TiresCatalogStyles.mainWrapper}>
            <p className="pageTitle">Каталог шин</p>
            <SortHeader />
            <div className={TiresCatalogStyles.content}>
                <DesktopTiresFilters />
                <div className={TiresCatalogStyles.cards}>
                    {[...Array(10)].map(item => {
                        return <TiresCardDesktop />
                    })}
                </div>
            </div>
            <div className={TiresCatalogStyles.contentMobile}>
                <div className={TiresCatalogStyles.sortFilter}>
                    <SortHeaderMobile />
                    <MobileTiresFilters />
                </div>
                <div className={TiresCatalogStyles.cardsMobile}>
                    {[...Array(10)].map(item => {
                        return <TiresCardMobile />
                    })}
                </div>
            </div>
        </div>
    )
}