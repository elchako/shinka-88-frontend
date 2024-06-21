import type React from "react"
import Checkbox from "react-custom-checkbox";
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { filterButtons } from "../../../consts"
import { seasonsSelectMany, seasonsSelectSelector } from "../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice";
import checkedIcon from '../../../imgs/checked.png'


export const SeasonFilter: React.FC = () => {
    const season = useAppSelector(seasonsSelectSelector)
    const dispatch = useAppDispatch()

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