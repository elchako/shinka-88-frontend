import type React from "react"
import TiresFiltersStyles from "./TiresFiltersStyles.module.scss"
import { useAppDispatch } from "../../../../../app/hooks"
import { mobileFiltersReducer } from "../../../../common/slices/smallActions"


export const MobileTiresFilters: React.FC = () => {
    const dispatch = useAppDispatch()
    return (
            <div onClick={() => dispatch(mobileFiltersReducer())} className={TiresFiltersStyles.mainWrapperMobile}>
                <div className={TiresFiltersStyles.mobileFilterImg}></div>
                <div className={TiresFiltersStyles.mobileTitle}>Параметры</div>
                <div className={TiresFiltersStyles.mobileFiltersCounter}>2</div>
            </div>
    )
}