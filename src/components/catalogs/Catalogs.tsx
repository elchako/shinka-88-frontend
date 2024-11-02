import type React from "react"
import { useRef } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useLocation } from "react-router-dom"
import { useAppDispatch, useCatalogDataHook } from "../../app/hooks"
import { addDisksToCart, addTyresToCart, delOneTypeProduct } from "../../app/slices/cartSlice"
import '../../common.scss'
import runflat from '../../imgs/tiresCard/runflat.png'
import strong from '../../imgs/tiresCard/strong.png'
import summer from '../../imgs/tiresCard/summer.png'
import winter from '../../imgs/tiresCard/winter.png'
import { type resultsDisksType } from "../../types/disks"
import { type resultsTyresType } from "../../types/tires"
import { DisksCardDesktop } from "./blocks/card/disks/DisksCardDesktop"
import { DisksCardMobile } from "./blocks/card/disks/DisksCardMobile"
import { TyresCardDesktop } from "./blocks/card/tyres/TyresCardDesktop"
import { TyresCardMobile } from "./blocks/card/tyres/TyresCardMobile"
import { DesktopFilters } from "./blocks/filters/DesktopFilters"
import { MobileDisksFilters } from "./blocks/filters/MobileDisksFilters"
import { MobileTyresFilters } from "./blocks/filters/MobileTyresFilters"
import { DisksSortHeaderMobile } from "./blocks/sortHeader/DisksSortHeaderMobile"
import { SortHeader } from "./blocks/sortHeader/SortHeader"
import { TyresSortHeaderMobile } from "./blocks/sortHeader/TyresSortHeaderMobile"
import CatalogStyles from "./CatalogStyles.module.scss"
import { Helmet } from "react-helmet-async"


export const Catalogs: React.FC = () => {
    const dispatch = useAppDispatch()

    // данные для каталога
    // в зависимости от страницы
    const { pathname } = useLocation()
    const catalogData = useCatalogDataHook(pathname)

    // элемент бесконечной прокрутки
    const scrollableElement = useRef<HTMLDivElement>(null)

    // добавление шин в корзину
    const addToCartTiresHandler = (data: resultsTyresType, inCart: boolean): void => {
        if (inCart) {
            const productType = data.product_type
            const id = data.id
            dispatch(delOneTypeProduct({ productType, id }))
        } else {
            dispatch(addTyresToCart(data))
        }
    }

    // добавление дисков в корзину
    const addToCartDisksHandler = (data: resultsDisksType, inCart: boolean): void => {
        if (inCart) {
            const productType = data.product_type
            const id = data.id
            dispatch(delOneTypeProduct({ productType, id }))
        } else {
            dispatch(addDisksToCart(data))
        }
    }

    return (
        <>
            <Helmet>
                <title>Шинка88 - Каталог</title>
            </Helmet>
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
                            {catalogData.cardsData.results.length !== 0
                                ? catalogData.cardsData.results.map((item, index) => {
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
                                })
                                : <p>Ничего не найдено</p>}
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
                        {catalogData.cardsData.results.length
                            ? catalogData.cardsData.results.map((item, index) => {
                                if (catalogData.title === 'Каталог шин') {
                                    return <TyresCardMobile handler={addToCartTiresHandler}
                                        data={item as resultsTyresType} key={`${item} - ${index}`} />
                                }
                                if (catalogData.title === 'Каталог дисков') {
                                    return <DisksCardMobile handler={addToCartDisksHandler}
                                        data={item as resultsDisksType} key={`${item} - ${index}`} />
                                }
                                return null
                            })
                            : <p>Ничего не найдено</p>}
                    </div>
                </div>
            </div>
        </>
    )
}