import type React from "react"
import TiresFiltersStyles from "./TiresFiltersStyles.module.scss"
import { checkboxesNames, filterButtons, selectsNames1 } from "../../../../../consts"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import {
    checkboxesSelect,
    checkboxesSelectSelector,
    seasonsSelectOne, seasonsSelectSelector,
    selectSelector, selectsSelect, tiresAPISelector
} from "../../../main/blocks/filters/filtersBlocks/filterBlock1Slice"
import Checkbox from "react-custom-checkbox";
import checkedIcon from '../../../../../imgs/checked.png'
import explanation from '../../../../../imgs/explanation.png'
import { ExplanationModal } from "../../../main/blocks/filters/filtersBlocks/ExplanationModal"
import { useState } from "react"
import { OffenButton } from "../../../../common/OffenButton"
import { mobileFiltersReducer, mobileFiltersSelector } from "../../../../common/slices/smallActions"

export const MobileFiltersModal: React.FC = () => {
    // открытие/закрытие модалки
    const mobileFiltersState = useAppSelector(mobileFiltersSelector)

    // открытие/закрытие меню дополнительно
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const tires = useAppSelector(tiresAPISelector)
    const selectsSelects = useAppSelector(selectSelector)
    const season = useAppSelector(seasonsSelectSelector)
    const checkboxesSelects = useAppSelector(checkboxesSelectSelector)

    const dispatch = useAppDispatch()

    let openCloseStyles = null
    mobileFiltersState
    ? openCloseStyles = 'none'
    : openCloseStyles = 'block'
    
    return (
        <div style={{display: openCloseStyles}} className={TiresFiltersStyles.mainWrapperMobileModal}>
            <div className={TiresFiltersStyles.modalMobile}>
                <div className={TiresFiltersStyles.modalMobileTop}>
                    <p>Параметры</p>
                    <div className={TiresFiltersStyles.modalMobilesButtons}>
                        <p>Сбросить</p>
                        <div onClick={() => dispatch(mobileFiltersReducer())} className={TiresFiltersStyles.closeFilters}></div>
                    </div>
                </div>
                <div className={TiresFiltersStyles.modalMobileMiddle}>
                    {selectsNames1.map((item, index) => {
                        return <div className={TiresFiltersStyles.selectMobile} key={`${index} - ${item}`}>
                            <p>{item}</p>
                            {tires[index] !== undefined
                                ? <select defaultValue={selectsSelects[index].value === ''
                                    ? '-'
                                    : selectsSelects[index].value} key={`${index} - ${item}`}
                                    onChange={e => dispatch(selectsSelect({
                                        selectName: item,
                                        value: e.currentTarget.value,
                                        isMainPage: true
                                    }))}>
                                    <option value='-' disabled>-</option>
                                    {tires[index].map(item => {
                                        if (selectsSelects[index].value === String(item.value)) {
                                            return <option value={item.value} >{item.name}</option>
                                        }
                                        return <option value={item.value}>{item.name}</option>
                                    })}
                                </select>
                                : <input type="text" onChange={e => dispatch(selectsSelect({
                                    selectName: item,
                                    value: e.currentTarget.value,
                                    isMainPage: true
                                }))} />
                            }
                        </div>
                    })}
                    <div className={TiresFiltersStyles.modalMobileFilterButtons}>
                        {filterButtons.map((item, index) =>
                            <button key={`${index} - ${item}`} className={season[0] === item
                                ? TiresFiltersStyles.modalMobileSelectedButton : ''}
                                onClick={() => dispatch(seasonsSelectOne(item))}>{item}</button>)}
                    </div>
                    <div className={TiresFiltersStyles.checkboxesMobile}>
                        <Checkbox
                            icon={<img src={checkedIcon} alt="checked" className="checkboxesImgMobile" />}
                            label={checkboxesNames[0]}
                            className='checkboxesInput'
                            labelClassName='checkboxesLabelMobile'
                            checked={checkboxesSelects[0].value}
                            onChange={() => dispatch(checkboxesSelect(checkboxesNames[0]))}
                        />
                        <Checkbox
                            icon={<img src={checkedIcon} alt="checked" className="checkboxesImgMobile" />}
                            label={checkboxesNames[1]}
                            className='checkboxesInput'
                            labelClassName='checkboxesLabelMobile'
                            checked={checkboxesSelects[1].value}
                            onChange={() => dispatch(checkboxesSelect(checkboxesNames[1]))}
                        />
                        <div>
                            <Checkbox
                                icon={<img src={checkedIcon} alt="checked" className="checkboxesImgMobile" />}
                                label={checkboxesNames[2]}
                                className='checkboxesInput'
                                labelClassName='checkboxesLabelMobile'
                                checked={checkboxesSelects[2].value}
                                onChange={() => dispatch(checkboxesSelect(checkboxesNames[2]))}
                            />
                            <img src={explanation} alt="explanation" onClick={() => setIsModalOpen(true)} />
                            <ExplanationModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                        </div>
                    </div>
                    <div className={TiresFiltersStyles.selectMobile}>
                        <p>Цена</p>
                        <div className={TiresFiltersStyles.priceContentMobile}>
                            <div className={TiresFiltersStyles.priceFromMobile}>
                                <input type="text" placeholder="3 500" />
                            </div>
                            <div className={TiresFiltersStyles.priceLineMobile}></div>
                            <div className={TiresFiltersStyles.priceToMobile}>
                                <input type="text" placeholder="20 000" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={TiresFiltersStyles.modalMobileBottom}>
                    <OffenButton name={'ПРИМЕНИТЬ ПАРАМЕТРЫ'} />
                </div>
            </div>
        </div>
    )
}