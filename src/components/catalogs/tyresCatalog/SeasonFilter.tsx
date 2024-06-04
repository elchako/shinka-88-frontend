import type React from "react"
import Checkbox from "react-custom-checkbox";
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { filterButtons } from "../../../consts"
import { getTyresParametrs, seasonsSelectMany, seasonsSelectSelector, tiresAPISelector } from "../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice";
import type { tiresAPI } from "../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice";
import checkedIcon from '../../../imgs/checked.png'
import { useEffect } from "react";


export const SeasonFilter: React.FC = () => {
    const season = useAppSelector(seasonsSelectSelector)
    const tiresAPI = useAppSelector(tiresAPISelector)

    const dispatch = useAppDispatch()

    useEffect(() => {
        let dataIsEmpty = true
        for (const key in tiresAPI) {
            if (tiresAPI[key as keyof tiresAPI].length === 0) {
                dataIsEmpty = false
            }
        }

        if (!dataIsEmpty) dispatch(getTyresParametrs(''))
    }, [dispatch, tiresAPI])
    return (
        <div className={FiltersStyles.season}>
            <p className={FiltersStyles.filterTitle}>Сезон</p>
            {filterButtons.map((item, index) => {
                if (index === 0) return null
                let isChecked
                season.filter(el => el.name === item.name).length !== 0 ? isChecked = true : isChecked = false
                return <div key={`${index} ${item.name}`} className={FiltersStyles.seasonBlock}>
                    <Checkbox
                        icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                        label={item.name}
                        className='checkboxesInput'
                        labelClassName={FiltersStyles.inputLabel}
                        checked={isChecked}
                        onChange={() => dispatch(seasonsSelectMany(item))}
                    />
                </div>
            })}
        </div>
    )
}