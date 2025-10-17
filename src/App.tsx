import "./App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainPage } from "./components/pages/main/MainPage"
import { links } from './consts'
import { Header } from "./components/header/Header"
import { MobileMenu } from "./components/Menu/MobileMenu/MobileMenu"
import { HiddenMobileMenu } from "./components/Menu/MobileMenu/HiddenMobileMenu"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { Cart } from "./components/pages/cart/Cart"
import { PlacingOrder } from "./components/pages/placingOrder/PlacingOrder"
import { AutoParts } from "./components/pages/autoParts/AutoParts"
import { Police } from "./components/pages/police/Police" 
import { AboutUs } from "./components/pages/aboutUs/AboutUs"
import { Oferta } from "./components/pages/oferta/Oferta"
import { Purchaser } from "./components/pages/purchaser/Purchaser"
import { Catalogs } from "./components/catalogs/Catalogs"
import { MobileFiltersModal } from "./components/catalogs/blocks/filters/MobileFiltersModal"
import { useEffect } from "react"
import { mobileFiltersSelector } from "./app/slices/common/smallActions"
import { pullLocalStorageData } from "./app/slices/cartSlice"
import { RegModal } from "./components/common/RegModal"
import { CreateOrder } from "./components/common/CreateOrderModal"
import { HelmetProvider } from "react-helmet-async"


export const App = () => {
  // закрытие/открытие мобильных параметров в каталоге меню
  const mobileFiltersState = useAppSelector(mobileFiltersSelector)
  const dispatch = useAppDispatch()
  let modalStyle = {
    overflow: 'auto',
    height: 'auto',
  }
  if (mobileFiltersState) {
    modalStyle.overflow = 'initial'
    modalStyle.height = 'auto'
  } else {
    modalStyle.overflow = 'hidden'
    modalStyle.height = '100vh'
  }

  // восстановление корзины из localtorage
  useEffect(() => {
    dispatch(pullLocalStorageData())
  }, [dispatch])

  return (
    <div style={{
      overflow: modalStyle.overflow,
      height: modalStyle.height,
    }}>
      <HelmetProvider>
        <BrowserRouter basename="/">
          {/* <BrowserRouter> */}
          <Header />
          <HiddenMobileMenu />
          <MobileFiltersModal />
          <RegModal />
          <CreateOrder />
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
          <MobileMenu />
        </BrowserRouter>
      </HelmetProvider>
    </div>
  )
}
