import type React from "react"
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import Checkbox from "react-custom-checkbox";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import checkedIcon from '../../../imgs/checked.png'
import { checkboxesSelect, checkboxesSelectSelector } from "../../../app/slices/filters/tiresFiltersSlice";

// дополнительные фильтры
export const AdditionalFilter: React.FC = () => {
    const dispatch = useAppDispatch()
    const checkboxes = useAppSelector(checkboxesSelectSelector)

    return (
        <div className={FiltersStyles.additionally}>
            <p className={FiltersStyles.filterTitle}>Дополнительно</p>
            {checkboxes.map((item, index) => {
                if (index === 2) return null
                return <div key={`${index} ${item}`} className={FiltersStyles.seasonBlock}>
                    <Checkbox
                        icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                        label={item.checkboxName}
                        className='checkboxesInput'
                        labelClassName={FiltersStyles.inputLabel}
                        checked={item.checked}
                        onChange={() => dispatch(checkboxesSelect(item.checkboxName))}
                    />
                </div>
            })}
        </div>
    )
}