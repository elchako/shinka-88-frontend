import type React from "react"
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import Checkbox from "react-custom-checkbox";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { checkboxesSelect, checkboxesSelectSelector } from "../../pages/main/blocks/filters/filtersBlocks/filterBlock1Slice"
import checkedIcon from '../../../imgs/checked.png'

export const AdditionalFilter: React.FC = () => {
    const checkboxes = useAppSelector(checkboxesSelectSelector)

    const dispatch = useAppDispatch()
    return (
        <div className={FiltersStyles.additionally}>
            <p className={FiltersStyles.filterTitle}>Дополнительно</p>
            {checkboxes.map((item, index) => {
                if (index === 2) return null
                console.log(item.checked)
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