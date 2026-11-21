import type { PayloadAction } from "@reduxjs/toolkit"
import type { IinitialState } from "../../types/auth"
import { createAppSlice } from "../createAppSlice"
import { authApi } from "../../api/auth"
import { normalizeAuthError, type AuthFailure } from '../../utils/authError'
import { normalizePhoneNumber } from '../../utils/other'

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
        getSmsCode: create.asyncThunk<void, { name: string, phone: string }, { rejectValue: AuthFailure }>(
            async (args, api) => {
                try { await authApi.getSmsCode(args.name, args.phone) }
                catch (error) { throw api.rejectWithValue(normalizeAuthError(error)) }
            },
            {
                fulfilled: state => { state.oftensmsCodeReq = false },
                rejected: state => { state.oftensmsCodeReq = true },
            },
        ),
        login: create.asyncThunk<string, { phone: string, code: string }, { rejectValue: AuthFailure }>(
            async (args, api) => {
                try {
                    const response = await authApi.login(args.phone, args.code)
                    const current = (api.getState() as { auth: IinitialState }).auth.phone
                    if (normalizePhoneNumber(current) !== normalizePhoneNumber(args.phone)) throw new Error('stale_auth_response')
                    return response.token
                } catch (error) { throw api.rejectWithValue(normalizeAuthError(error, true)) }
            },
            {
                pending: state => { state.checkProcess = true },
                fulfilled: (state, action) => {
                    state.checkProcess = false
                    if (normalizePhoneNumber(state.phone) !== normalizePhoneNumber(action.meta.arg.phone)) return
                    state.token = action.payload
                    state.isLogin = true
                },
                rejected: state => {
                    // Подтверждение завершилось отказом, без переключения stale-флага.
                    state.checkProcess = false
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
