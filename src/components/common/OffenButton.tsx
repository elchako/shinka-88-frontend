import type React from "react"
import commonStyles from "./common.module.scss"

interface IProps {
    name: string
    handler?: () => void
}

export const OffenButton: React.FC<IProps> = ({ name, handler }) => {
    return (
        <div onClick={handler} className={commonStyles.mainWrapperOffenButton}>
            <p>{name}</p>
        </div>
    )
}