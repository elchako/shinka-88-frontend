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
import { addDisksToCart, addTyresToCart } from "../../app/slices/cartSlice"
import { type resultsTyresType } from "../../types/tires"
import { type resultsDisksType } from "../../types/disks"
import summer from '../../imgs/tiresCard/summer.png'
import winter from '../../imgs/tiresCard/winter.png'
import runflat from '../../imgs/tiresCard/runflat.png'
import strong from '../../imgs/tiresCard/strong.png'


export const Catalogs: React.FC = () => {
    const dispatch = useAppDispatch()

    // данные для каталога
    // в зависимости от страницы
    const { pathname } = useLocation()
    const catalogData = useCatalogDataHook(pathname)

    // элемент бесконечной прокрутки
    const scrollableElement = useRef<HTMLDivElement>(null)

    // добавление шин в корзину
    const addToCartTiresHandler = (data: resultsTyresType): void => {
        dispatch(addTyresToCart(data))
    }

    // добавление дисков в корзину
    const addToCartDisksHandler = (data: resultsDisksType): void => {
        dispatch(addDisksToCart(data))
    }

    return (
        <div className={CatalogStyles.mainWrapper}>
            <p className="pageTitle">{catalogData.title}</p>

            {/* сортировка */}
            <div className={CatalogStyles.sortPrompt}>
                <SortHeader sortData={catalogData.sortData} />
                <div className={CatalogStyles.promptHiddenWrapper}>
                    <div className={CatalogStyles.promptWrapper}>
                        <p>Подсказки:</p>
                        <div className={CatalogStyles.prompts}>
                            <div>
                                <img src={summer} alt="лето" />
                                <p>лето</p>
                            </div>
                            <div>
                                <img src={winter} alt="зима" />
                                <p>зима</p>
                            </div>
                            <div>
                                <img src={runflat} alt="runflat" />
                                <p>runflat</p>
                            </div>
                            <div>
                                <img src={strong} alt="усиленные" />
                                <p>усиленные</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={CatalogStyles.content}>

                {/* десктопные фильтры */}
                <DesktopFilters
                    filterBlocks={<catalogData.filtersBlocks parentRef={scrollableElement} />}
                    commonFilters={catalogData.commonFilters} />
                {/* карточки с бесконечной прокруткой */}
                <div className={CatalogStyles.cards} id='scrollableDiv'
                    ref={scrollableElement}>
                    <InfiniteScroll
                        dataLength={catalogData.cardsData.results.length}
                        next={() => dispatch(catalogData.sortData.newDataReq(false))}
                        hasMore={catalogData.cardsData.next !== null}
                        loader={'Загрузка...'}
                        scrollableTarget='scrollableDiv'
                    >

                        {/* карточки товаров в зависимости от страницы */}
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

                {/* мобильная сортировка и фильтры */}
                <div className={CatalogStyles.sortFilter}>
                    {catalogData.title === 'Каталог шин'
                        ? <TyresSortHeaderMobile />
                        : <DisksSortHeaderMobile />}
                    {catalogData.title === 'Каталог шин'
                        ? <MobileTyresFilters />
                        : <MobileDisksFilters />}
                </div>
                <div className={CatalogStyles.cardsMobile}>
                    {/* мобильные карточки товаров в зависимости от страницы */}
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