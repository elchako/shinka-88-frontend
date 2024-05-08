import type React from "react"
import FiltersStyles from "./FiltersStyles.module.scss"
import { useAppDispatch } from "../../../../app/hooks"
import { mobileFiltersReducer } from "../../../common/slices/smallActions"


export const MobileFilters: React.FC = () => {
    const dispatch = useAppDispatch()
    return (
        <div onClick={() => dispatch(mobileFiltersReducer())} className={FiltersStyles.mainWrapperMobile}>
            <div className={FiltersStyles.mobileFilterImg}></div>
            <div className={FiltersStyles.mobileTitle}>Параметры</div>
            <div className={FiltersStyles.mobileFiltersCounter}>2</div>
        </div>
    )
}