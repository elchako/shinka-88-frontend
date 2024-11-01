import type React from "react"
import commonStyles from "./common.module.scss"

interface IProps {
    name: string
    handler?: () => void
    styles?: string
}

export const OffenButton: React.FC<IProps> = ({ name, handler, styles }) => {
    let buttonStyles = commonStyles.mainWrapperOffenButton
    if (styles) {
        buttonStyles = commonStyles.mainWrapperOffenButton + ' ' + styles
    }
    return (
        <div onClick={handler} className={buttonStyles}>
            <p>{name}</p>
        </div>
    )
}