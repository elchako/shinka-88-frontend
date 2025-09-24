import type { PayloadAction } from "@reduxjs/toolkit"
import type { IinitialState } from "../../types/auth"
import { createAppSlice } from "../createAppSlice"
import { authApi } from "../../api/auth"

const initialState: IinitialState = {
    name: '',
    phone: '',
    regModal: false,
    smsCode: false,
    oftensmsCodeReq: false,
    token: '',
    checkProcess: false,
    isLogin: false,
    customerLocalData: null
}

export const authSlice = createAppSlice({
    name: "auth",
    initialState,
    reducers: create => ({
        // данные о клиенте из localstorage
        setCustomerLocalData: create.reducer((state, action: PayloadAction<string | null>) => {
            state.customerLocalData = action.payload
        }),
        // изменить имя
        setName: create.reducer((state, action: PayloadAction<string>) => {
            state.name = action.payload
        }),
        // изменить телефон
        setPhone: create.reducer((state, action: PayloadAction<string>) => {
            state.phone = action.payload
        }),
        // сохранить токен в стейт
        setToken: create.reducer((state, action: PayloadAction<string>) => {
            state.token = action.payload
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
        setLoginToggle: create.reducer((state) => {
            state.isLogin = false
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
                    state.oftensmsCodeReq = false
                    console.log('succes')
                },
                rejected: state => {
                    state.oftensmsCodeReq = true
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
                    // console.log('запрос на авторизацию')
                },
                fulfilled: (state, action: PayloadAction<string>) => {
                    // console.log('авторизация прошла успешно')
                    state.token = action.payload
                    state.checkProcess = !state.checkProcess
                    state.isLogin = true
                    alert('Теперь можете отправить заказ')
                },
                rejected: state => {
                    // console.log('авторизация неудачна')
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
        oftensmsCodeReqSelector: state => state.oftensmsCodeReq,
        regModalSelector: state => state.regModal,
        checkProcessSelector: state => state.checkProcess,
        isLoginSelector: state => state.isLogin,
        customerLocalDataSelector: state => state.customerLocalData,
    },
})

// actions
export const { getSmsCode, toogleModal, toogleSmsCode, setName, setPhone,
    login, setCheckProcess, setToken, setLoginToggle, setCustomerLocalData
} =
    authSlice.actions

// selectors
export const { smsCodeSelector, regModalSelector, nameSelector, phoneSelector,
    tokenSelector, checkProcessSelector, oftensmsCodeReqSelector, isLoginSelector,
    customerLocalDataSelector
} =
    authSlice.selectors
