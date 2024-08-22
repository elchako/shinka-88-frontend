import type { PayloadAction } from "@reduxjs/toolkit"
import type { IinitialState } from "../../types/auth"
import { createAppSlice } from "../createAppSlice"
import { authApi } from "../../api/auth"

const initialState: IinitialState = {
    name: '',
    phone: '',
    regModal: false,
    smsCode: false,
    token: '',
    checkProcess: false,
}

export const authSlice = createAppSlice({
    name: "auth",
    initialState,
    reducers: create => ({
        // изменить имя
        setName: create.reducer((state, action: PayloadAction<string>) => {
            state.name = action.payload
        }),
        // изменить телефон
        setPhone: create.reducer((state, action: PayloadAction<string>) => {
            state.phone = action.payload
        }),
        // показывать или скрывать модалку
        toogleModal: create.reducer((state) => {
            state.regModal = !state.regModal
        }),
        // выслан код или нет
        toogleSmsCode: create.reducer((state) => {
            state.smsCode = !state.smsCode
        }),
        // код проверяется
        setCheckProcess: create.reducer((state) => {
            state.checkProcess = !state.checkProcess
        }),
        // получить код
        getSmsCode: create.asyncThunk(
            async (args: { name: string, phone: string }) => {
                await authApi.getSmsCode(args.name, args.phone)
            },
            {
                pending: () => {
                    console.log('pending')
                },
                fulfilled: state => {
                    console.log('code was send')
                },
                rejected: () => {
                    console.log('error')
                },
            },
        ),
        login: create.asyncThunk(
            async (args: { phone: string, code: string }) => {
                const response = await authApi.login(args.phone, args.code)
                return response.token
            },
            {
                pending: state => {
                    state.checkProcess = !state.checkProcess
                },
                fulfilled: (state, action: PayloadAction<string>) => {
                    state.token = action.payload
                    state.checkProcess = !state.checkProcess
                },
                rejected: state => {
                    state.checkProcess = !state.checkProcess
                },
            },
        ),
    }),
    selectors: {
        nameSelector: state => state.name,
        phoneSelector: state => state.phone,
        tokenSelector: state => state.token,
        smsCodeSelector: state => state.smsCode,
        regModalSelector: state => state.regModal,
        checkProcessSelector: state => state.checkProcess
    },
})

// actions
export const { getSmsCode, toogleModal, toogleSmsCode, setName, setPhone,
    login, setCheckProcess
} =
    authSlice.actions

// selectors
export const { smsCodeSelector, regModalSelector, nameSelector, phoneSelector,
    tokenSelector, checkProcessSelector
} =
    authSlice.selectors
