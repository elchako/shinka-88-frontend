import type React from "react"
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { filterButtons } from "../../../consts"
import { seasonsSelectOne, seasonsSelectSelector } from "../../../app/slices/filters/tiresFiltersSlice"


// сезоны фильтр мобильный
export const SeasonFilterMobile: React.FC = () => {
    const dispatch = useAppDispatch()
    const season = useAppSelector(seasonsSelectSelector)

    return (
        <div className={FiltersStyles.modalMobileFilterButtons}>
            {filterButtons.map((item, index) =>
                <button key={`${index} - ${index} - ${item.name}`} className={season[0]?.name === item.name
                    ? FiltersStyles.modalMobileSelectedButton : ''}
                    onClick={() => dispatch(seasonsSelectOne(item))}>{item.name}</button>)}
        </div>
    )
}