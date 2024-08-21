import type { PayloadAction } from "@reduxjs/toolkit"
import type { IinitialState } from "../../types/auth"
import { createAppSlice } from "../createAppSlice"
import { authApi } from "../../api/auth"

const initialState: IinitialState = {
    smsCode: ""
}

export const authSlice = createAppSlice({
    name: "auth",
    initialState,
    reducers: create => ({
        getToken: create.asyncThunk(
            async (args: { name: string, number: string }) => {
                const response = await authApi.getToken(args.name, args.number)
                console.log(response)
                return response
            },
            {
                pending: () => {
                    console.log('pending')
                },
                fulfilled: (state, action: PayloadAction<string>) => {
                    state.smsCode = action.payload
                },
                rejected: () => {
                    console.log('error')
                },
            },
        ),
    }),
    selectors: {
        smsCodeSelector: state => state.smsCode
    },
})

// actions
export const { getToken } =
    authSlice.actions

// selectors
export const { smsCodeSelector } =
    authSlice.selectors
