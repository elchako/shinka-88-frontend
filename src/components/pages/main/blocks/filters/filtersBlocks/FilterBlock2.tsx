import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import { links, selectsNames2, tabsButtons } from '../../../../../../consts'
import explanation from '../../../../../../imgs/explanation.png'
import { MainFiltersButton } from "../MainFiltersButton"
import { ExplanationModal } from "./ExplanationModal"
import type { ITabsProps } from "../MainFilters"
import Checkbox from "react-custom-checkbox";
import checkedIcon from '../../../../../../imgs/checked.png'
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks"
import { disksAPISelector, getDisksParametrs, selectSelector, selectsSelect } from "./filterBlock2Slice"
import { useEffect } from "react"
import type { disksAPI } from "./filterBlock2Slice"
import { useNavigate } from "react-router-dom"

export const FilterBlock2: React.FC<ITabsProps> = ({ isModalOpen, setIsModalOpen }) => {
    const selects = useAppSelector(selectSelector)
    const disksAPI = useAppSelector(disksAPISelector)

    const navigate = useNavigate()
    const dispatch = useAppDispatch()


    useEffect(() => {
        dispatch(getDisksParametrs(''))
    }, [dispatch])

    return (
        <div className={FilterBlocksStyles.mainWrapper}>
            <div className={FilterBlocksStyles.selects}>
                {selects.map((item, index) => {
                    let values = [...disksAPI[item.selectName.apiName as keyof disksAPI]]
                    values.sort()
                    return <div className={FilterBlocksStyles.select} key={index}>
                        <p>{item.selectName.displayName}</p>
                        <select defaultValue='' key={`${index} - ${item}`}
                            onChange={e => dispatch(selectsSelect({
                                selectName: item.selectName.apiName,
                                value: e.currentTarget.value,
                            }))}>
                            <option value='' disabled>-</option>
                            {values.map((item, index) => {
                                return <option key={`${item} - ${index}`} value={item as string}>{item}</option>
                            })}
                        </select>
                    </div>
                })}
            </div>
            <div className={FilterBlocksStyles.bottomBlock}>
                <div className={FilterBlocksStyles.checkboxes}>
                    {/* <div className={FilterBlocksStyles.checkboxesMinHeight}>
                        <Checkbox
                            icon={<img src={checkedIcon} alt="checked" className="checkboxesImg" />}
                            label="Бесплатный шиномонтаж"
                            className='checkboxesInput'
                            labelClassName='checkboxesLabel'
                        />
                        <img src={explanation} alt="explanation" onClick={() => setIsModalOpen(true)} />
                        <ExplanationModal />
                    </div> */}
                </div>
                <MainFiltersButton handler={() => navigate(links[4].link)} title={tabsButtons[1]} />
            </div>
        </div>
    )
}