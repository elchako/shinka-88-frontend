import "./App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainPage } from "./components/pages/main/MainPage"
import { links } from './consts'
import { Header } from "./components/header/Header"
import { MobileMenu } from "./components/Menu/MobileMenu/MobileMenu"
import { HiddenMobileMenu } from "./components/Menu/MobileMenu/HiddenMobileMenu"
import { TiresCatalog } from "./components/pages/tiresCatalog/TiresCatalog"
import { MobileFiltersModal } from "./components/pages/tiresCatalog/blocks/filters/MobileFiltersModal"
import { useAppSelector } from "./app/hooks"
import { mobileFiltersSelector } from "./components/common/slices/smallActions"
import { Cart } from "./components/pages/cart/Cart"
import { PlacingOrder } from "./components/pages/placingOrder/PlacingOrder"

export const App = () => {
  const mobileFiltersState = useAppSelector(mobileFiltersSelector) // закрытие/открытие мобильных параметров в каталоге меню

  let modalStyle = {
    overflow: 'auto',
    height: 'auto',
  }
  if(mobileFiltersState) {
    modalStyle.overflow = 'auto'
    modalStyle.height = 'auto'
  } else {
    modalStyle.overflow = 'hidden'
    modalStyle.height = '100vh'
  }

  return (
    <div style={{ overflow: modalStyle.overflow, height: modalStyle.height }}>
      <BrowserRouter >
        <Header />
        <HiddenMobileMenu />
        <MobileFiltersModal />
        <Routes>
          <Route path={links[0].link} element={<MainPage />} />
          <Route path={links[3].link} element={<TiresCatalog />} />
          <Route path={links[1].link} element={<Cart />} />
          <Route path={links[10].link} element={<PlacingOrder />} />
        </Routes>
        <MobileMenu />
      </BrowserRouter>
    </div>
  )
}
