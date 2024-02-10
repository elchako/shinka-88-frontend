import type React from "react";
import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";
import { DesktopMenu } from "../Menu/DesktopMenu/DesktopMenu";


export const Header: React.FC = () => {
    return (
        <>
            <DesktopHeader />
            <DesktopMenu />
            <MobileHeader />
        </>)
}