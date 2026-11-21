import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector, useCatalogDataHook } from '../../app/hooks'
import { addDisksToCart, addTyresToCart } from '../../app/slices/cartSlice'
import { mobileFiltersSelector } from '../../app/slices/common/smallActions'
import { getDisksCards, getDisksParametrs, resetFilters as resetDisks, setOnlyCompleteSets as setDiskCompleteSets } from '../../app/slices/filters/disksFiltersSlice'
import { getTyresCards, getTyresParametrs, resetFilters as resetTyres, setOnlyCompleteSets as setTyreCompleteSets } from '../../app/slices/filters/tiresFiltersSlice'
import type { resultsDisksType } from '../../types/disks'
import type { resultsTyresType } from '../../types/tires'
import { Button } from '../common/Button'
import { Icon } from '../common/Icon'
import { Modal } from '../common/Modal'
import { DisksCardDesktop } from './blocks/card/disks/DisksCardDesktop'
import { TyresCardDesktop } from './blocks/card/tyres/TyresCardDesktop'
import { DesktopFilters } from './blocks/filters/DesktopFilters'
import { MobileDisksFilters } from './blocks/filters/MobileDisksFilters'
import { MobileTyresFilters } from './blocks/filters/MobileTyresFilters'
import { SortHeader } from './blocks/sortHeader/SortHeader'
import { CatalogGuide } from './CatalogGuide'
import { ProductHelp } from '../common/ProductHelp'
import { seasonValues, studdingValues } from '../../utils/catalogFilters'
import styles from './CatalogStyles.module.scss'

export const Catalogs: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isDisks = pathname === '/disks'
  const catalog = useCatalogDataHook(pathname)
  const filters = useAppSelector(state => isDisks ? state.disksFilters : state.tiresFilters)
  const tyreExtras = useAppSelector(state => state.tiresFilters)
  const filtersClosed = useAppSelector(mobileFiltersSelector)
  const parentRef = useRef<HTMLDivElement>(null)
  const requestedKey = useRef('')
  const [guideOpen, setGuideOpen] = useState(false)
  useEffect(() => setGuideOpen(false), [pathname])
  const needsTyreMetadata = !isDisks && (tyreExtras.season !== 'all' || tyreExtras.studding !== 'all')
  const waitingForMetadata = needsTyreMetadata && filters.filtersStatus !== 'succeeded'
  const metadataFailed = waitingForMetadata && filters.filtersStatus === 'failed'
  const filterKey = JSON.stringify([
    filters.selects, filters.priceStart, filters.priceEnd, filters.onlyCompleteSets,
    ...(!isDisks ? [tyreExtras.season, tyreExtras.studding,
      seasonValues(tyreExtras.tiresAPI.response_data.seazon, tyreExtras.season),
      studdingValues(tyreExtras.tiresAPI.response_data.thorning, tyreExtras.studding),
      tyreExtras.checkboxes.slice(0, 2).map(item => [item.checked, item.checked ? item.value : []])] : []),
  ])
  const requestKey = `${pathname}:${filters.sortType}:${filterKey}`
  const { cardsData } = catalog
  const commonFilters = {
    ...catalog.commonFilters,
    priceMinNumber: filters.filtersStatus === 'succeeded' ? catalog.commonFilters.priceMinNumber : null,
    priceMaxNumber: filters.filtersStatus === 'succeeded' ? catalog.commonFilters.priceMaxNumber : null,
  }
  const changedFilters = requestedKey.current !== requestKey
  const hasCards = cardsData.results.length > 0
  const isLoading = waitingForMetadata ? !metadataFailed
    : filters.cardsStatus === 'loading' || filters.cardsStatus === 'idle' || (filtersClosed && changedFilters)
  const replacingResults = waitingForMetadata || changedFilters
    || (filters.cardsRefresh && (filters.cardsStatus === 'loading' || filters.cardsStatus === 'idle' || filters.cardsStatus === 'failed'))
  const staleResults = hasCards && replacingResults
  const showResults = hasCards || (!replacingResults && filters.cardsStatus === 'succeeded')

  useEffect(() => {
    if (filters.filtersStatus !== 'idle') return
    if (isDisks) dispatch(getDisksParametrs())
    else dispatch(getTyresParametrs())
  }, [dispatch, isDisks, filters.filtersStatus])

  // Один источник запросов для обеих ширин. В диалоге изменения применяются при закрытии.
  useEffect(() => {
    if (waitingForMetadata || !filtersClosed || requestedKey.current === requestKey) return
    requestedKey.current = requestKey
    if (isDisks) dispatch(getDisksCards(true))
    else dispatch(getTyresCards(true))
  }, [dispatch, filtersClosed, isDisks, requestKey, waitingForMetadata])

  const requestCards = (refresh: boolean) => {
    if (!refresh && replacingResults) return
    if (isDisks) dispatch(getDisksCards(refresh))
    else dispatch(getTyresCards(refresh))
  }
  const reset = () => {
    if (isDisks) dispatch(resetDisks())
    else dispatch(resetTyres())
  }
  const addTyres = (data: resultsTyresType, inCart: boolean) => {
    if (staleResults) return
    if (inCart) navigate('/cart')
    else dispatch(addTyresToCart(data))
  }
  const addDisks = (data: resultsDisksType, inCart: boolean) => {
    if (staleResults) return
    if (inCart) navigate('/cart')
    else dispatch(addDisksToCart(data))
  }

  const guide = <Modal isOpen={guideOpen} onClose={() => setGuideOpen(false)} keepMounted mobileFullscreen
    title={isDisks ? 'Помощь с подбором дисков' : 'Помощь с подбором шин'} size="lg">
    <div className={styles.guideDialog}><CatalogGuide isDisks={isDisks} /></div>
  </Modal>

  return (
    <main className={styles.mainWrapper}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link to="/">Главная</Link><Icon name="chevron" size={13} /><span>{catalog.title}</span>
      </nav>
      <div className={styles.heading}>
        <div><h1>{catalog.title}</h1><p>{isDisks
          ? 'Подберите колёсные диски по ширине, диаметру, креплению, вылету, ступице и типу. Цены и наличие смотрите в каталоге магазина «Шинка88» в Егорьевске.'
          : 'Подберите летние, зимние или всесезонные шины по размеру. Цены и наличие смотрите в каталоге магазина «Шинка88» в Егорьевске.'}</p></div>
        {cardsData.count != null && filters.cardsStatus === 'succeeded' && !waitingForMetadata
          && <span className={styles.count}>Найдено: {cardsData.count}</span>}
      </div>
      <div className={styles.content} data-js-catalog>
        <div className={styles.sidebar}>
          <DesktopFilters filterBlocks={<catalog.filtersBlocks parentRef={parentRef} />} commonFilters={commonFilters} />
          {filters.filtersStatus === 'loading' && <p className={styles.filterFeedback} role="status">Загружаем параметры…</p>}
          {filters.filtersStatus === 'failed' && <div className={styles.filterFeedback} role="alert">
            <p>Не удалось загрузить параметры.</p>
            <Button variant="outline" size="sm" onClick={() => {
              if (isDisks) dispatch(getDisksParametrs())
              else dispatch(getTyresParametrs())
            }}>Повторить</Button>
          </div>}
        </div>
        <section className={styles.results} aria-label="Товары каталога" aria-busy={isLoading}>
          <div className={styles.guideAccess}>
            <Button type="button" variant="outline" size="sm" onClick={() => setGuideOpen(true)} leftIcon={<Icon name="info" size={17} />}>
              {isDisks ? 'Как подобрать диски' : 'Как подобрать шины'}
            </Button>
          </div>
          <div className={styles.catalogTop}>
            {isDisks ? <MobileDisksFilters /> : <MobileTyresFilters />}
            <SortHeader sortData={catalog.sortData} />
            <label className={`${styles.availabilityFilter} ${filters.onlyCompleteSets ? styles.availabilityActive : ''}`}>
              <input type="checkbox" checked={filters.onlyCompleteSets}
                onChange={event => dispatch((isDisks ? setDiskCompleteSets : setTyreCompleteSets)(event.currentTarget.checked))} />
              Есть 4 шт. и больше
            </label>
            <span className={styles.priceNote}>Цена за штуку</span>
          </div>
          {staleResults && isLoading && <p role="status" className={styles.paginationStatus}>Обновляем товары… Предыдущая выдача временно недоступна для покупки.</p>}
          {!hasCards && isLoading && (filters.cardsRefresh || waitingForMetadata || changedFilters) && <div role="status" className={styles.loading}>
            <p>Загружаем товары…</p>
            {[0, 1, 2].map(index => <div key={index} className={styles.skeleton} aria-hidden="true"><span /><div><span /><span /><span /></div></div>)}
          </div>}
          {metadataFailed && <div className={styles.feedback} role="alert">
            <h2>Не удалось загрузить параметры поиска</h2>
            <p>Для выбранного сезона и шипов нужен актуальный справочник. Повторите загрузку параметров.</p>
            <Button onClick={() => dispatch(getTyresParametrs())}>Загрузить параметры поиска</Button>
          </div>}
          {!waitingForMetadata && filters.cardsStatus === 'failed' && <div className={styles.feedback} role="alert">
            <Icon name="alert" size={32} /><h2>Не удалось загрузить товары</h2>
            <p>{filters.cardsError}</p>
            <Button onClick={() => requestCards(filters.cardsRefresh)}>Попробовать ещё раз</Button>
          </div>}
          {showResults && <fieldset disabled={staleResults} className={styles.resultSet} aria-label={staleResults ? 'Предыдущая выдача, ожидается обновление' : 'Результаты подбора'}>
            <InfiniteScroll key={requestKey} dataLength={cardsData.results.length} hasChildren={cardsData.results.length > 0}
            next={() => requestCards(false)} hasMore={!replacingResults && cardsData.next !== null && filters.cardsStatus !== 'failed'}
            loader={<p className={styles.paginationStatus} role="status">Загружаем ещё…</p>}
            style={{ overflow: 'visible' }}>
            <div className={styles.cards}>
              {cardsData.results.map(item => isDisks
                ? <DisksCardDesktop key={item.id} data={item as resultsDisksType} handler={addDisks} />
                : <TyresCardDesktop key={item.id} data={item as resultsTyresType} handler={addTyres} />)}
            </div>
          </InfiniteScroll></fieldset>}
          {!waitingForMetadata && filters.cardsStatus === 'succeeded' && cardsData.results.length === 0 && <div className={styles.feedback} role="status">
            <Icon name={isDisks ? 'wheel' : 'tire'} size={40} /><h2>Товары не найдены</h2>
            <p>Попробуйте изменить параметры подбора или сбросить фильтры.</p>
            <Button variant="outline" onClick={reset}>Сбросить параметры</Button>
            <ProductHelp />
          </div>}
          {showResults && !replacingResults && cardsData.next !== null && filters.cardsStatus !== 'failed' && <div className={styles.pagination}>
            <Button variant="outline" isLoading={isLoading} onClick={() => requestCards(false)}>Показать ещё</Button>
          </div>}
        </section>
      </div>
      {guideOpen && typeof document !== 'undefined' ? createPortal(guide, document.body) : guide}
    </main>
  )
}
