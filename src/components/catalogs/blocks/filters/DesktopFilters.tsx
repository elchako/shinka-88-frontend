import type React from "react"
import FiltersStyles from "./FiltersStyles.module.scss"
import '../../../../common.scss'
import type { ReactElement } from "react"
import { useAppDispatch } from "../../../../app/hooks"

interface IProps {
    filterBlocks: ReactElement
    commonFilters: {
        resetFiltersAction: any;
        priceStartNumber: number;
        priceEndNumber: number;
        priceSetter: any;
    }
}

export const DesktopFilters: React.FC<IProps> = ({ filterBlocks, commonFilters }) => {
    const dispatch = useAppDispatch()
    const priceStart = commonFilters.priceStartNumber
    const priceEnd = commonFilters.priceEndNumber

    return (
        <div className={FiltersStyles.mainWrapper}>
            <p className={FiltersStyles.title}>ПАРАМЕТРЫ</p>
            <div className={FiltersStyles.filters}>
                {filterBlocks}
                {/* <div className={FiltersStyles.manufacturer}>
                    <p className={FiltersStyles.filterTitle}>Производитель</p>
                    <div className={FiltersStyles.manContent}>
                        {manufacturersAPI.map((item, index) => {
                            return <div key={`${index} ${item}`} className={FiltersStyles.seasonBlock}>
                                <Checkbox
                                    icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                                    label={item.name}
                                    className='checkboxesInput'
                                    labelClassName={FiltersStyles.inputLabel}
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
                </div> */}
                <div className={FiltersStyles.price}>
                    <p className={FiltersStyles.filterTitle}>Цена</p>
                    <div className={FiltersStyles.priceContent}>
                        <div className={FiltersStyles.priceFrom}>
                            <input type="text" placeholder="3 500"
                                value={priceStart === 0 ? '' : priceStart}
                                onChange={e =>
                                    dispatch(commonFilters.priceSetter({
                                        number: Number(e.currentTarget.value),
                                        isStartOrEnd: true
                                    }))} />
                        </div>
                        <div className={FiltersStyles.priceLine}></div>
                        <div className={FiltersStyles.priceTo}>
                            <input type="text" placeholder="20 000"
                                value={priceEnd === 0 ? '' : priceEnd}
                                onChange={e =>
                                    dispatch(commonFilters.priceSetter({
                                        number: Number(e.currentTarget.value),
                                        isStartOrEnd: false
                                    }))} />
                        </div>
                    </div>
                </div>
                <div className={FiltersStyles.clearFilters}>
                    <button onClick={() => dispatch(commonFilters.resetFiltersAction())} className={FiltersStyles.title
                        + ' ' + FiltersStyles.clearButton}>Сбросить все параметры</button>
                </div>
            </div>
        </div>
    )
}