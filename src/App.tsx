import './App.css'
import { BrowserRouter, Link, Route, Routes, StaticRouter, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SeoHead } from './seo/SeoHead'
import { MainPage } from './components/pages/main/MainPage'
import { links } from './consts'
import { Header } from './components/header/Header'
import { MobileMenu } from './components/Menu/MobileMenu/MobileMenu'
import { HiddenMobileMenu } from './components/Menu/MobileMenu/HiddenMobileMenu'
import { useAppDispatch } from './app/hooks'
import { Cart } from './components/pages/cart/Cart'
import { PlacingOrder } from './components/pages/placingOrder/PlacingOrder'
import { AutoParts } from './components/pages/autoParts/AutoParts'
import { Services } from './components/pages/services/Services'
import { Police } from './components/pages/police/Police'
import { AboutUs } from './components/pages/aboutUs/AboutUs'
import { Oferta } from './components/pages/oferta/Oferta'
import { Purchaser } from './components/pages/purchaser/Purchaser'
import { Catalogs } from './components/catalogs/Catalogs'
import { MobileFiltersModal } from './components/catalogs/blocks/filters/MobileFiltersModal'
import { pullLocalStorageData } from './app/slices/cartSlice'
import { RegModal } from './components/common/RegModal'
import { CreateOrder } from './components/common/CreateOrderModal'

const RouteScroll = () => {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function NotFound() {
  return (
    <main className="notFound">
      <h1 className="pageTitle">Страница не найдена</h1>
      <p>Проверьте адрес или вернитесь в <Link to="/tires">каталог шин</Link> и <Link to="/disks">колёсных дисков</Link>.</p>
    </main>
  )
}

export const App = ({ prerenderPath }: { prerenderPath?: string }) => {
  const dispatch = useAppDispatch()
  useEffect(() => { dispatch(pullLocalStorageData()) }, [dispatch])

  const content = (
    <>
      <SeoHead />
      <RouteScroll />
      <a className="skipLink" href="#main-content">К содержимому</a>
      <Header />
      <HiddenMobileMenu />
      <MobileFiltersModal />
      <RegModal />
      <CreateOrder />
      <div className="routeContent" id="main-content" tabIndex={-1}>
        <Routes>
          <Route caseSensitive path={links[0].link} element={<MainPage />} />
          <Route caseSensitive path={links[3].link} element={<Catalogs />} />
          <Route caseSensitive path={links[4].link} element={<Catalogs />} />
          <Route caseSensitive path={links[5].link} element={<AutoParts category="oils" />} />
          <Route caseSensitive path={links[6].link} element={<AutoParts category="akb" />} />
          <Route caseSensitive path={links[7].link} element={<AutoParts />} />
          <Route caseSensitive path={links[8].link} element={<Services />} />
          <Route caseSensitive path={links[1].link} element={<Cart />} />
          <Route caseSensitive path={links[10].link} element={<PlacingOrder />} />
          <Route caseSensitive path={links[11].link} element={<Police />} />
          <Route caseSensitive path={links[12].link} element={<AboutUs />} />
          <Route caseSensitive path={links[13].link} element={<Oferta />} />
          <Route caseSensitive path={links[14].link} element={<Purchaser />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <MobileMenu />
    </>
  )
  return (
    <div className="appShell">
      {prerenderPath
        ? <StaticRouter location={prerenderPath}>{content}</StaticRouter>
        : <BrowserRouter>{content}</BrowserRouter>}
    </div>
  )
}
