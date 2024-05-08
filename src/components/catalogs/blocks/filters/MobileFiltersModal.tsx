import type React from "react"
import FiltersStyles from "./FiltersStyles.module.scss"
import { useState } from "react"
import { useAppDispatch, useAppSelector, useCatalogDataHook } from "../../../../app/hooks";
import { mobileFiltersReducer, mobileFiltersSelector } from "../../../common/slices/smallActions";
import { OffenButton } from "../../../common/OffenButton";
import { useLocation } from "react-router-dom";

export const MobileFiltersModal: React.FC = () => {
    // открытие/закрытие модалки
    const mobileFiltersState = useAppSelector(mobileFiltersSelector)

    const { pathname } = useLocation()
    const catalogData = useCatalogDataHook(pathname)

    // открытие/закрытие меню дополнительно
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    let openCloseStyles = null
    mobileFiltersState
        ? openCloseStyles = 'none'
        : openCloseStyles = 'block'

    return (
        <div style={{ display: openCloseStyles }} className={FiltersStyles.mainWrapperMobileModal}>
            <div className={FiltersStyles.modalMobile}>
                <div className={FiltersStyles.modalMobileTop}>
                    <p>Параметры</p>
                    <div className={FiltersStyles.modalMobilesButtons}>
                        <p>Сбросить</p>
                        <div onClick={() => dispatch(mobileFiltersReducer())} className={FiltersStyles.closeFilters}></div>
                    </div>
                </div>
                <div className={FiltersStyles.modalMobileMiddle}>
                    {<catalogData.filtersBlocksMobile />}
                    <div className={FiltersStyles.selectMobile}>
                        <p>Цена</p>
                        <div className={FiltersStyles.priceContentMobile}>
                            <div className={FiltersStyles.priceFromMobile}>
                                <input type="text" placeholder="3 500" />
                            </div>
                            <div className={FiltersStyles.priceLineMobile}></div>
                            <div className={FiltersStyles.priceToMobile}>
                                <input type="text" placeholder="20 000" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={FiltersStyles.modalMobileBottom}>
                    <OffenButton name={'ПРИМЕНИТЬ ПАРАМЕТРЫ'} />
                </div>
            </div>
        </div>
    )
}