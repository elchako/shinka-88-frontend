import type React from "react"
import FiltersStyles from '../blocks/filters/FiltersStyles.module.scss'
import Checkbox from "react-custom-checkbox";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import checkedIcon from '../../../imgs/checked.png'
import { checkboxesNames } from "../../../consts";
import { checkboxesSelect, checkboxesSelectSelector } from "../../../app/slices/filters/tiresFiltersSlice";


// дополнительные фильтры мобильные
export const AdditionalFilterMobile: React.FC = () => {
    const dispatch = useAppDispatch()
    const checkboxesSelects = useAppSelector(checkboxesSelectSelector)

    return (
        <div className={FiltersStyles.checkboxesMobile}>
            <Checkbox
                icon={<img src={checkedIcon} alt="checked" className="checkboxesImgMobile" />}
                label={checkboxesNames[0]}
                className='checkboxesInput'
                labelClassName='checkboxesLabelMobile'
                checked={checkboxesSelects[0].checked}
                onChange={() => dispatch(checkboxesSelect(checkboxesNames[0]))}
            />
            <Checkbox
                icon={<img src={checkedIcon} alt="checked" className="checkboxesImgMobile" />}
                label={checkboxesNames[1]}
                className='checkboxesInput'
                labelClassName='checkboxesLabelMobile'
                checked={checkboxesSelects[1].checked}
                onChange={() => dispatch(checkboxesSelect(checkboxesNames[1]))}
            />
        </div>
    )
}