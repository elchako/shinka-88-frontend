import type React from "react"
import CatalogStyles from "./CatalogStyles.module.scss"
import '../../common.scss'
import { SortHeader } from "./blocks/sortHeader/SortHeader"
import { DesktopFilters } from "./blocks/filters/DesktopFilters"
import { TyresSortHeaderMobile } from "./blocks/sortHeader/TyresSortHeaderMobile"
import { MobileTyresFilters } from "./blocks/filters/MobileTyresFilters"
import { TyresCardMobile } from "./blocks/card/tyres/TyresCardMobile"
import { useLocation } from "react-router-dom"
import { useAppDispatch, useCatalogDataHook } from "../../app/hooks"
import InfiniteScroll from "react-infinite-scroll-component"
import { TyresCardDesktop } from "./blocks/card/tyres/TyresCardDesktop"
import { DisksCardDesktop } from "./blocks/card/disks/DisksCardDesktop"
import { useRef } from "react"
import { DisksCardMobile } from "./blocks/card/disks/DisksCardMobile"
import { MobileDisksFilters } from "./blocks/filters/MobileDisksFilters"
import { DisksSortHeaderMobile } from "./blocks/sortHeader/DisksSortHeaderMobile"
import { type resultsTyresType } from "../../app/slices/filters/tiresFiltersSlice"
import { type resultsDisksType } from "../../app/slices/filters/disksFiltersSlice"
import { addDisksToCart, addTyresToCart } from "../../app/slices/cartSlice"

export const Catalogs: React.FC = () => {
    const { pathname } = useLocation()
    const catalogData = useCatalogDataHook(pathname)
    const dispatch = useAppDispatch()
    const scrollableElement = useRef<HTMLDivElement>(null)

    const addToCartTiresHandler = (data: resultsTyresType): void => {
        dispatch(addTyresToCart(data))
    }
    const addToCartDisksHandler = (data: resultsDisksType): void => {
        dispatch(addDisksToCart(data))
    }
    return (
        <div className={CatalogStyles.mainWrapper}>
            <p className="pageTitle">{catalogData.title}</p>
            <SortHeader sortData={catalogData.sortData} />
            <div className={CatalogStyles.content}>
                <DesktopFilters
                    filterBlocks={<catalogData.filtersBlocks parentRef={scrollableElement} />}
                    commonFilters={catalogData.commonFilters} />
                <div className={CatalogStyles.cards} id='scrollableDiv'
                    ref={scrollableElement}>
                    <InfiniteScroll
                        dataLength={catalogData.cardsData.results.length}
                        next={() => dispatch(catalogData.sortData.newDataReq(false))}
                        hasMore={catalogData.cardsData.next !== null}
                        loader={'Загрузка...'}
                        scrollableTarget='scrollableDiv'
                    >
                        {catalogData.cardsData.results.map((item, index) => {
                            if (catalogData.title === 'Каталог шин') {
                                return <TyresCardDesktop
                                    handler={addToCartTiresHandler}
                                    data={item as resultsTyresType}
                                    key={`${item} - ${index}`} />
                            }
                            if (catalogData.title === 'Каталог дисков') {
                                return <DisksCardDesktop
                                    handler={addToCartDisksHandler}
                                    data={item as resultsDisksType}
                                    key={`${item} - ${index}`} />
                            }
                            return null
                        })}
                    </InfiniteScroll>
                </div>
            </div>
            <div className={CatalogStyles.contentMobile}>
                <div className={CatalogStyles.sortFilter}>
                    {catalogData.title === 'Каталог шин'
                        ? <TyresSortHeaderMobile />
                        : <DisksSortHeaderMobile />}
                    {catalogData.title === 'Каталог шин'
                        ? <MobileTyresFilters />
                        : <MobileDisksFilters />}
                </div>
                <div className={CatalogStyles.cardsMobile}>
                    {catalogData.cardsData.results.map((item, index) => {
                        if (catalogData.title === 'Каталог шин') {
                            return <TyresCardMobile handler={addToCartTiresHandler}
                                data={item as resultsTyresType} key={`${item} - ${index}`} />
                        }

                        if (catalogData.title === 'Каталог дисков') {
                            return <DisksCardMobile handler={addToCartDisksHandler}
                                data={item as resultsDisksType} key={`${item} - ${index}`} />
                        }
                        return null
                    })}
                </div>
            </div>
        </div>
    )
}