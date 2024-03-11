import type React from "react"
import AutoPartsStyles from "./AutoPartsStyles.module.scss"
import '../../../common.scss'
import { AutoPartsCard } from "./blocks/card/AutoPartsCard"
import searchIcon from '../../../imgs/searchIcon.png'


export const AutoParts: React.FC = () => {
    return (
        <div className={AutoPartsStyles.mainWrapper}>
            <p className="pageTitle">Автозапчасти</p>
            <div className={AutoPartsStyles.content}>
                <div className={AutoPartsStyles.searchBlock}>
                    <div className={AutoPartsStyles.searchTop}>
                        <input type="text" placeholder="введите VIN запчасти" />
                        <button>
                            <p>ПОИСК</p>
                            <img src={searchIcon} alt="searchIcon" />
                        </button>
                    </div>
                    <p>Во избежание ошибок по подборке запчастей по VIN запчасти
                        свяжитесь с нашим менеджером то тел. +7(919)772-88-88</p>
                </div>
            </div>
            <div className={AutoPartsStyles.cards}>
                {[...Array(20)].map(item => {
                    return <AutoPartsCard />
                })}
            </div>
        </div>
    )
}