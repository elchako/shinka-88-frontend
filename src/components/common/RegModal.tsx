import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    checkProcessSelector, getSmsCode, login, isLoginSelector, nameSelector,
    oftensmsCodeReqSelector,
    phoneSelector, regModalSelector, smsCodeSelector,
    tokenSelector, toogleModal, toogleSmsCode,
    setLoginToggle,
    setToken,
    setCustomerLocalData
} from "../../app/slices/authSlice";
import Styles from './common.module.scss';
import Cookies from 'js-cookie';

export const RegModal: React.FC = () => {
    const dispatch = useAppDispatch()
    const regModal = useAppSelector(regModalSelector)
    const smsCode = useAppSelector(smsCodeSelector)
    const name = useAppSelector(nameSelector)
    const phone = useAppSelector(phoneSelector)
    const token = useAppSelector(tokenSelector)
    const isLogin = useAppSelector(isLoginSelector)
    const [codeValue, setCodeValue] = useState<string>('')
    const checkProcess = useAppSelector(checkProcessSelector)
    const oftensmsCodeReq = useAppSelector(oftensmsCodeReqSelector)

    // показывать или скрывать модалку
    let openStyle
    if (regModal) {
        openStyle = Styles.placingOrderWrapper
    } else {
        openStyle = Styles.placingOrderWrapper + ' ' + Styles.placingOrderWrapperHidden
    }

    // получить код
    const getCodeHandler = () => {
        if (!oftensmsCodeReq) {
            dispatch(toogleSmsCode())
            dispatch(getSmsCode({ name, phone }))
        } else {
            alert(`Слишком много запросов. Вы можете запросить проверочный код 3 раза за час.`)
        }
    }

    // отправка кода
    const codeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (checkProcess) return
        if (e.target.value.length <= 6) setCodeValue(e.target.value)
        if (e.target.value.length === 6) {
            dispatch(login({ phone, code: e.target.value }))
        }
    }

    // закрытие модалки
    const closeModal = useCallback(() => {
        dispatch(toogleModal())
        if (smsCode) dispatch(toogleSmsCode())
    }, [dispatch, smsCode])

    useEffect(() => {
        const customerLocalData = localStorage.getItem('customerLocalData')
        const data = JSON.parse(customerLocalData as string)
        if (isLogin) {
            Cookies.set('token', token)
            if (data) {
                data.phone = phone
                const newLocalData = JSON.stringify(data)
                localStorage.setItem('customerLocalData', newLocalData)
                dispatch(setCustomerLocalData(newLocalData))
            }
            alert(localStorage.getItem('customerLocalData'))
            setCodeValue('')
            closeModal()
            dispatch(setLoginToggle())
        }
        alert(isLogin)
    }, [isLogin])

    return <div className={openStyle}>
        <div className={Styles.placingOrder}>
            <div className={Styles.placingOrderContent}>
                <div className={Styles.closeplacingOrder}
                    onClick={closeModal}>&#10006;</div>
                <p>Мы Вас не узнали на этом устройстве.<br />Просьба подтвердить Ваш номер телефона.</p>
                {smsCode
                    ? <input className={Styles.placingOrderSmsCode} type="number" placeholder="введите код из смс"
                        onChange={e => codeHandler(e)}
                        value={codeValue} />
                    : <button className={Styles.placingOrderButton}
                        onClick={() => getCodeHandler()}>Отправить смс-код на номер {phone}</button>}
                {smsCode && <p className={Styles.placingOrderWasSend}>{`код отправлен на номер ${phone}`}</p>}
            </div>
        </div>
    </div>
}