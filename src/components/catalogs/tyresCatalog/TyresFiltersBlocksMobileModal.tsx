import type React from "react"
import { SizeFilterMobile } from "./SizeFilterMobile"
import { SeasonFilterMobile } from "./SeasonFilteMobile"
import { AdditionalFilterMobile } from "./AdditionalFilterMobile"


export const TyresFilterBlocksMobileModal: React.FC = () => {
    return (
        <>
            <SizeFilterMobile />
            <SeasonFilterMobile />
            <AdditionalFilterMobile />
        </>
    )
}