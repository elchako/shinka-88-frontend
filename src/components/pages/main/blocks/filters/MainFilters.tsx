import type React from "react"
import * as R from "react"
import MainFiltersStyles from "./MainFilters.module.scss"
import { useState } from "react"
import { tabs } from '../../../../../consts'
import arrow from '../../../../../imgs/filtersMobileMenu.png'
import { AutoPartsFilterBlock2 } from "./filtersBlocks/AutoPartsFilterBlock2"
import { TiresFilterBlock1 } from "./filtersBlocks/TiresFilterBlock1"
import { DisksFilterBlock2 } from "./filtersBlocks/DisksFilterBlock2"
import { OilsFilterBlock3 } from "./filtersBlocks/OilsFilterBlock3"
import { AKBFilterBlock4 } from "./filtersBlocks/AKBFilterBlock4"

export interface ITabsProps {
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const MainFilters: React.FC = () => {
    // переключение табов на десктопе и телефоне
    const [selectedTab, setSelectedTab] = useState<number>(0)
    const [mobileSelectedTab, setMobileSelectedTab] = useState<number | null>(null)
    const toggleTabs = (index: number): void => {
        setSelectedTab(index)
        if (mobileSelectedTab === index) {
            setMobileSelectedTab(null)
        } else {
            setMobileSelectedTab(index)
        }
    }

    // контент табов
    const tabsContent = [<TiresFilterBlock1 />,
    <DisksFilterBlock2 />, <OilsFilterBlock3 />,
    <AKBFilterBlock4 />, <AutoPartsFilterBlock2 />]
    return (
        <div className={MainFiltersStyles.mainWrapper}>
            <div className={MainFiltersStyles.header}>
                {tabs.map((item, index) => {
                    // скрытие/открытие для десктопных табов
                    let tabStyle = null
                    index === selectedTab
                        ? tabStyle = MainFiltersStyles.tab + ' ' + MainFiltersStyles.selectedTab
                        : tabStyle = MainFiltersStyles.tab
                    // скрытие/открытие для мобильных табов
                    let tabMobileStyle = null
                    let arrowStyles = null
                    if (index === mobileSelectedTab) {
                        tabMobileStyle = MainFiltersStyles.mobileContent
                            + ' ' + MainFiltersStyles.selectedmobileContent

                        arrowStyles = MainFiltersStyles.arrow + ' ' + MainFiltersStyles.arrowUp
                    } else {
                        tabMobileStyle = MainFiltersStyles.mobileContent
                        arrowStyles = MainFiltersStyles.arrow
                    }
                    let content = null
                    mobileSelectedTab === null ? content = '' : content = tabsContent[mobileSelectedTab]
                    return <R.Fragment key={`${index} - ${item}`}>
                        <div className={tabStyle}
                            id={item} onClick={() => toggleTabs(index)}>
                            <p>{item}</p>
                            <img className={arrowStyles} src={arrow} alt="arrow" />
                        </div>
                        <div className={tabMobileStyle}>{content}</div>
                    </R.Fragment>
                })}
            </div>
            <div className={MainFiltersStyles.content}>
                {tabsContent[selectedTab]}
            </div>
        </div>
    )
}