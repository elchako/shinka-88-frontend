import type React from "react"
import MainPageStyles from "./MainPageStyles.module.scss"
import banner from '../../../imgs/mainBanner.png'
import smallBanner from '../../../imgs/smallMainBanner.png'
import { MainFilters } from "./blocks/filters/MainFilters"


export const MainPage: React.FC = () => {
    return (
        <div className={MainPageStyles.mainWrapper}>
            <div className={MainPageStyles.banner}>
                <img src={banner} alt="banner" />
                <img src={smallBanner} alt="small banner" />
            </div>
            <MainFilters />
        </div>
    )
}