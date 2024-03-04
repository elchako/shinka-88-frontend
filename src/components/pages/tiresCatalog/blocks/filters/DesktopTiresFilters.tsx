import type React from "react"
import TiresFiltersStyles from "./TiresFiltersStyles.module.scss"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import '../../../../../common.scss'
import { checkboxesSelect, checkboxesSelectSelector, manufacturerAPISelector, seasonsSelectMany, seasonsSelectSelector, selectSelector, selectedManufacturersSelector, selectsSelect, tiresAPISelector } from "../../../main/blocks/filters/filtersBlocks/filterBlock1Slice"
import { filterButtons, selectsNames1 } from "../../../../../consts"
import Checkbox from "react-custom-checkbox";
import checkedIcon from '../../../../../imgs/checked.png'


export const DesktopTiresFilters: React.FC = () => {
    const selectsSelects = useAppSelector(selectSelector)
    const tires = useAppSelector(tiresAPISelector)
    const season = useAppSelector(seasonsSelectSelector)
    const manufacturersAPI = useAppSelector(manufacturerAPISelector)
    const selectedManufacturers = useAppSelector(selectedManufacturersSelector)
    const checkboxes = useAppSelector(checkboxesSelectSelector)

    const dispatch = useAppDispatch()

    return (
        <div className={TiresFiltersStyles.mainWrapper}>
            <p className={TiresFiltersStyles.title}>ПАРАМЕТРЫ</p>
            <div className={TiresFiltersStyles.filters}>
                <div className={TiresFiltersStyles.size}>
                    <p className={TiresFiltersStyles.filterTitle}>Размер</p>
                    {selectsNames1.map((item, index) => {
                        if (index === 3) return null
                        return <select className={TiresFiltersStyles.select} defaultValue={selectsSelects[0].value === ''
                            ? '-'
                            : selectsSelects[0].value}>
                            <option value='-' disabled>{item}</option>
                            {tires[index].map(item => {
                                if (selectsSelects[index].value === item.value) {
                                    return <option value={item.value} >{item.name}</option>
                                }
                                return <option value={item.value}>{item.name}</option>
                            })}
                        </select>
                    })}
                </div>
                <div className={TiresFiltersStyles.season}>
                    <p className={TiresFiltersStyles.filterTitle}>Сезон</p>
                    {filterButtons.map((item, index) => {
                        if (index === 0) return null
                        return <div key={`${index} ${item}`} className={TiresFiltersStyles.seasonBlock}>
                            <Checkbox
                                icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                                label={item}
                                className='checkboxesInput'
                                labelClassName={TiresFiltersStyles.inputLabel}
                                checked={season.includes(item)}
                                onChange={() => dispatch(seasonsSelectMany(item))}
                            />
                        </div>
                    })}
                </div>
                <div className={TiresFiltersStyles.manufacturer}>
                    <p className={TiresFiltersStyles.filterTitle}>Производитель</p>
                    <div className={TiresFiltersStyles.manContent}>
                        {manufacturersAPI.map((item, index) => {
                            return <div key={`${index} ${item}`} className={TiresFiltersStyles.seasonBlock}>
                                <Checkbox
                                    icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                                    label={item.name}
                                    className='checkboxesInput'
                                    labelClassName={TiresFiltersStyles.inputLabel}
                                    checked={selectedManufacturers.includes(item.value)}
                                    onChange={() => dispatch(selectsSelect({
                                        selectName: selectsNames1[0],
                                        value: item.value,
                                        isMainPage: false
                                    }))}
                                />
                            </div>
                        })}
                    </div>
                </div>
                <div className={TiresFiltersStyles.additionally}>
                    <p className={TiresFiltersStyles.filterTitle}>Дополнительно</p>
                    {checkboxes.map((item, index) => {
                        if (index === 2) return null
                        return <div key={`${index} ${item}`} className={TiresFiltersStyles.seasonBlock}>
                            <Checkbox
                                icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                                label={item.checkboxName}
                                className='checkboxesInput'
                                labelClassName={TiresFiltersStyles.inputLabel}
                                checked={item.value}
                                onChange={() => dispatch(checkboxesSelect(item.checkboxName))}
                            />
                        </div>
                    })}
                </div>
                <div className={TiresFiltersStyles.price}>
                    <p className={TiresFiltersStyles.filterTitle}>Цена</p>
                    <div className={TiresFiltersStyles.priceContent}>
                        <div className={TiresFiltersStyles.priceFrom}>
                            <input type="text" placeholder="3 500" />
                        </div>
                        <div className={TiresFiltersStyles.priceLine}></div>
                        <div className={TiresFiltersStyles.priceTo}>
                            <input type="text" placeholder="20 000" />
                        </div>
                    </div>
                </div>
                <div className={TiresFiltersStyles.clearFilters}>
                    <button className={TiresFiltersStyles.title 
                        + ' ' + TiresFiltersStyles.clearButton}>Сбросить все параметры</button>
                </div>
            </div>
        </div>
    )
}