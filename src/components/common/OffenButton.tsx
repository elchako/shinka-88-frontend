import type React from "react"
import commonStyles from "./common.module.scss"

interface IProps {
    name: string
}

export const OffenButton: React.FC<IProps> = ({ name }) => {
    return (
        <div className={commonStyles.mainWrapperOffenButton}>
            <p>{name}</p>
        </div>
    )
}