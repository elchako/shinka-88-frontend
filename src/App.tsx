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
import { Payment } from "./components/pages/payment/Payment"
import { AboutUs } from "./components/pages/aboutUs/AboutUs"
import { Guarantees } from "./components/pages/guarantees/Guarantees"
import { Catalogs } from "./components/catalogs/Catalogs"
import { MobileFiltersModal } from "./components/catalogs/blocks/filters/MobileFiltersModal"
import { useEffect } from "react"
import { mobileFiltersSelector } from "./app/slices/common/smallActions"
import { pullLocalStorageData } from "./app/slices/cartSlice"

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
      {/* <BrowserRouter basename="/shinka-88-frontend"> */}
      <BrowserRouter>
        <Header />
        <HiddenMobileMenu />
        <MobileFiltersModal />
        <Routes>
          <Route path={links[0].link} element={<MainPage />} />
          <Route path={links[3].link} element={<Catalogs />} />
          <Route path={links[4].link} element={<Catalogs />} />
          <Route path={links[7].link} element={<AutoParts />} />
          <Route path={links[1].link} element={<Cart />} />
          <Route path={links[10].link} element={<PlacingOrder />} />
          <Route path={links[11].link} element={<Payment />} />
          <Route path={links[12].link} element={<AboutUs />} />
          <Route path={links[13].link} element={<Guarantees />} />
        </Routes>
        <MobileMenu />
      </BrowserRouter>
    </div>
  )
}
