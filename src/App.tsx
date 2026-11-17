import './App.css'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { MainPage } from './components/pages/main/MainPage'
import { links } from './consts'
import { Header } from './components/header/Header'
import { MobileMenu } from './components/Menu/MobileMenu/MobileMenu'
import { HiddenMobileMenu } from './components/Menu/MobileMenu/HiddenMobileMenu'
import { useAppDispatch } from './app/hooks'
import { Cart } from './components/pages/cart/Cart'
import { PlacingOrder } from './components/pages/placingOrder/PlacingOrder'
import { AutoParts } from './components/pages/autoParts/AutoParts'
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
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export const App = () => {
  const dispatch = useAppDispatch()
  useEffect(() => { dispatch(pullLocalStorageData()) }, [dispatch])

  return (
    <div className="appShell">
      <HelmetProvider>
        <BrowserRouter basename="/">
          <RouteScroll />
          <a className="skipLink" href="#main-content">К содержимому</a>
          <Header />
          <HiddenMobileMenu />
          <MobileFiltersModal />
          <RegModal />
          <CreateOrder />
          <div className="routeContent" id="main-content" tabIndex={-1}>
            <Routes>
              <Route path={links[0].link} element={<MainPage />} />
              <Route path={links[3].link} element={<Catalogs />} />
              <Route path={links[4].link} element={<Catalogs />} />
              <Route path={links[7].link} element={<AutoParts />} />
              <Route path={links[1].link} element={<Cart />} />
              <Route path={links[10].link} element={<PlacingOrder />} />
              <Route path={links[11].link} element={<Police />} />
              <Route path={links[12].link} element={<AboutUs />} />
              <Route path={links[13].link} element={<Oferta />} />
              <Route path={links[14].link} element={<Purchaser />} />
            </Routes>
          </div>
          <MobileMenu />
        </BrowserRouter>
      </HelmetProvider>
    </div>
  )
}
