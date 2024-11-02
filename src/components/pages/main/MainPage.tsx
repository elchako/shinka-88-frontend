import type React from "react"
import MainPageStyles from "./MainPageStyles.module.scss"
import banner from '../../../imgs/mainBanner.png'
import smallBanner from '../../../imgs/smallMainBanner.png'
import { MainFilters } from "./blocks/filters/MainFilters"
import { Contacts } from "./blocks/contacts/Contacts"
import { Footer } from "../../footer/Footer"
import { Helmet } from "react-helmet-async"


export const MainPage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Шинка88</title>
            </Helmet>
            <div className={MainPageStyles.mainWrapper}>
                <div className={MainPageStyles.content}>
                    <div className={MainPageStyles.banner}>
                        <img src={banner} alt="banner" />
                        <img src={smallBanner} alt="small banner" />
                    </div>
                    <MainFilters />
                    <Contacts />
                </div>
                <Footer />
            </div>
        </>
    )
}