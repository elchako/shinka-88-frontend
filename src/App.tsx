import "./App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainPage } from "./components/pages/main/MainPage"
import { links } from './consts'
import { Header } from "./components/header/Header"
import { MobileMenu } from "./components/Menu/MobileMenu/MobileMenu"
import { HiddenMobileMenu } from "./components/Menu/MobileMenu/HiddenMobileMenu"
import { useState } from "react"

export const App = () => {
  const mobileMenuState = useState<boolean>(true) // закрытие/открытие мобильного меню
  return (
    <>
      <BrowserRouter >
        <Header />
        <HiddenMobileMenu mobileMenuState={mobileMenuState} />
        <Routes>
          <Route path={links[0].link} element={<MainPage />} />
        </Routes>
        <MobileMenu mobileMenuState={mobileMenuState} />
      </BrowserRouter>
    </>
  )
}
