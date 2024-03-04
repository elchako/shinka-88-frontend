import type React from "react"
import MainFiltersStyles from "./MainFilters.module.scss"
import { useState } from "react"
import { FilterBlock1 } from "./filtersBlocks/FilterBlock1"
import { tabs } from '../../../../../consts'
import arrow from '../../../../../imgs/hiddenMenuArrow.png'
import { FilterBlock2 } from "./filtersBlocks/FilterBlock2"
import { FilterBlock3 } from "./filtersBlocks/FilterBlock3"
import { FilterBlock4 } from "./filtersBlocks/FilterBlock4"
import { FilterBlock5 } from "./filtersBlocks/FilterBlock5"

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

    // открытие/закрытие модалки в табах
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    // контент табов
    const tabsContent = [<FilterBlock1 isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />,
    <FilterBlock2 isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />, <FilterBlock3 />,
    <FilterBlock4 />, <FilterBlock5 />]
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
                    return <>
                        <div className={tabStyle} id={item} key={`${index} - ${item}`} onClick={() => toggleTabs(index)}>
                            <p>{item}</p>
                            <img className={arrowStyles} src={arrow} alt="arrow" />
                        </div>
                        <div className={tabMobileStyle}>{content}</div>
                    </>
                })}
            </div>
            <div className={MainFiltersStyles.content}>
                {tabsContent[selectedTab]}
            </div>
        </div>
    )
}