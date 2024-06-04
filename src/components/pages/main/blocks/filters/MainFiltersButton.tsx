import type React from "react"
import MainFiltersStyles from "./MainFilters.module.scss"
import { tabsButtons } from '../../../../../consts'

interface IProps {
    title: string
    handler: () => void
}

export const MainFiltersButton: React.FC<IProps> = ({ title, handler }) => {
    let buttonStyles = MainFiltersStyles.sendButton
    if (title !== tabsButtons[0]) {
        buttonStyles = MainFiltersStyles.sendButton + ' ' + MainFiltersStyles.below
    }

    return (
        <button onClick={handler} className={buttonStyles}>{title}</button>
    )
}