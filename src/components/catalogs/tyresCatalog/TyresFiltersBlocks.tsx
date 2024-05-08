import type React from "react"
import { SizeFilter } from "./SizeFilter"
import { SeasonFilter } from "./SeasonFilter"
import { AdditionalFilter } from "./AdditionalFilter"


export const TyresFilterBlocks: React.FC = () => {
    return (
        <>
            <SizeFilter />
            <SeasonFilter />
            <AdditionalFilter />
        </>
    )
}