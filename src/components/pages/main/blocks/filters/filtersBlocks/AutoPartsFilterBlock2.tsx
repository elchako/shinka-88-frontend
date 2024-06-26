import type React from "react"
import FilterBlocksStyles from "./FilterBlocks.module.scss"
import { tabsButtons } from '../../../../../../consts'
import { MainFiltersButton } from "../MainFiltersButton"

export const AutoPartsFilterBlock2: React.FC = () => {

    return (
        <div className={FilterBlocksStyles.mainWrapper}>
            <div className={FilterBlocksStyles.selects}>
                <div className={FilterBlocksStyles.select}>
                    <p>VIN запчасти</p>
                    <input className={FilterBlocksStyles.vin} type="text" placeholder="Введите VIN запчасти" />
                </div>
            </div>
            <div className={FilterBlocksStyles.bottomBlock + ' ' + FilterBlocksStyles.bottomBlockJustButton}>
                <MainFiltersButton handler={() => console.log('')} title={tabsButtons[4]} />
            </div>
        </div>
    )
}