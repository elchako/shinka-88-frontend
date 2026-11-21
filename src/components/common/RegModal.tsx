import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  getSmsCode, login, nameSelector, phoneSelector, regModalSelector, smsCodeSelector, tokenSelector,
  toogleModal, toogleSmsCode, setLoginToggle, setCustomerLocalData,
} from '../../app/slices/authSlice'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { Icon } from './Icon'
import styles from './RegModal.module.scss'
import { normalizePhoneNumber } from '../../utils/other'
import type { AuthFailure } from '../../utils/authError'

const authIssue = (error: unknown): Partial<AuthFailure> => typeof error === 'object' && error !== null ? error as Partial<AuthFailure> : {}
const authErrorText = (error: unknown, verification: boolean): string => {
  const issue = authIssue(error)
  if (issue.limit === 'daily') return 'Достигнут суточный лимит SMS для номера. Дождитесь окончания указанного интервала.'
  if (issue.status === 429) return 'Слишком много запросов. Дождитесь окончания указанного интервала; повторная отправка сейчас недоступна.'
  if (verification && [400, 401, 403].includes(issue.status ?? 0)) return 'Код не подошёл или срок его действия истёк. Проверьте код или запросите новый.'
  if (issue.status === 403) return 'SMS-вход для этой учётной записи недоступен. Свяжитесь с магазином.'
  return verification
    ? 'Не удалось подтвердить номер. Проверьте соединение и повторите проверку.'
    : 'Не удалось отправить SMS. Сервис временно недоступен. Попробуйте ещё раз позже.'
}
const retryDelay = (failure: unknown) => {
  const value = authIssue(failure).retryAfter
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.min(86400, Math.ceil(value)) : 60
}
const waitLabel = (seconds: number) => seconds > 3600 ? `${Math.ceil(seconds / 3600)} ч` : seconds > 60 ? `${Math.ceil(seconds / 60)} мин` : `${seconds} с`

export const RegModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const regModal = useAppSelector(regModalSelector)
  const smsCode = useAppSelector(smsCodeSelector)
  const name = useAppSelector(nameSelector)
  const rawPhone = useAppSelector(phoneSelector)
  const phone = normalizePhoneNumber(rawPhone) || rawPhone
  const validRecipient = name.trim().length >= 2 && Boolean(normalizePhoneNumber(rawPhone))
  const token = useAppSelector(tokenSelector)
  const [code, setCode] = useState('')
  const [requestedPhone, setRequestedPhone] = useState('')
  const [retryAt, setRetryAt] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [verifyRetryAt, setVerifyRetryAt] = useState(0)
  const [verifySecondsLeft, setVerifySecondsLeft] = useState(0)
  const currentPhone = useRef(phone)
  const [sending, setSending] = useState(false)
  const [checking, setChecking] = useState(false)
  const [confirmedPhone, setConfirmedPhone] = useState('')
  const [error, setError] = useState('')
  const pending = useRef(false)
  const smsSent = requestedPhone === phone && Boolean(requestedPhone)
  const confirmed = Boolean(token && confirmedPhone && confirmedPhone === phone)

  useEffect(() => {
    const until = Math.max(retryAt, verifyRetryAt)
    if (!until) return
    const update = () => {
      setSecondsLeft(Math.max(0, Math.ceil((retryAt - Date.now()) / 1000)))
      setVerifySecondsLeft(Math.max(0, Math.ceil((verifyRetryAt - Date.now()) / 1000)))
    }
    update()
    const timer = window.setInterval(() => { update(); if (Date.now() >= until) window.clearInterval(timer) }, 1000)
    return () => window.clearInterval(timer)
  }, [retryAt, verifyRetryAt])

  useEffect(() => {
    currentPhone.current = phone
    setCode(''); setError(''); setRetryAt(0); setSecondsLeft(0); setVerifyRetryAt(0); setVerifySecondsLeft(0)
  }, [phone])

  const closeModal = () => {
    if (regModal) dispatch(toogleModal())
  }

  const sendCode = async () => {
    if (!validRecipient || pending.current || Date.now() < retryAt) return
    pending.current = true
    setSending(true)
    setError('')
    try {
      await dispatch(getSmsCode({ name, phone })).unwrap()
      if (currentPhone.current !== phone) return
      setRequestedPhone(phone)
      setCode('')
      if (!smsCode) dispatch(toogleSmsCode())
      setSecondsLeft(60)
      setRetryAt(Date.now() + 60_000)
    } catch (failure) {
      if (currentPhone.current !== phone) return
      setError(authErrorText(failure, false))
      if (![400, 403].includes(authIssue(failure).status ?? 0)) {
        const delay = retryDelay(failure)
        setSecondsLeft(delay); setRetryAt(Date.now() + delay * 1000)
      }
    }
    finally { pending.current = false; setSending(false) }
  }

  const verifyCode = async (value: string) => {
    if (value.length !== 6 || !smsSent || pending.current || Date.now() < verifyRetryAt) return
    pending.current = true
    setChecking(true)
    setError('')
    try {
      const token = await dispatch(login({ phone, code: value })).unwrap()
      if (currentPhone.current !== phone) return
      if (!token) throw new Error('empty_token')
      Cookies.set('token', token)
      const customer = JSON.stringify({ name: name.trim(), phone })
      try { localStorage.setItem('customerLocalData', customer) } catch { /* Сохраняем подтверждение в Redux. */ }
      dispatch(setCustomerLocalData(customer))
      dispatch(setLoginToggle())
      setConfirmedPhone(phone)
      setCode('')
    } catch (failure) {
      if (currentPhone.current !== phone) return
      setError(authErrorText(failure, true))
      if (authIssue(failure).status === 429) {
        const delay = retryDelay(failure)
        setVerifySecondsLeft(delay); setVerifyRetryAt(Date.now() + delay * 1000)
      }
    }
    finally { pending.current = false; setChecking(false) }
  }

  return (
    <Modal
      isOpen={regModal}
      onClose={closeModal}
      title={confirmed ? 'Телефон подтверждён' : 'Подтвердите телефон'}
      size="sm"
      footer={confirmed ? (
        <Button type="button" fullWidth onClick={closeModal} rightIcon={<Icon name="arrow" size={18} />}>Вернуться к оформлению</Button>
      ) : smsSent ? (
        <div className={styles.footer}>
          <Button type="button" fullWidth onClick={() => void verifyCode(code)} isLoading={checking} disabled={code.length !== 6 || sending || verifySecondsLeft > 0}>{verifySecondsLeft > 0 ? `Проверить через ${waitLabel(verifySecondsLeft)}` : 'Проверить код'}</Button>
          <Button type="button" variant="ghost" fullWidth onClick={() => void sendCode()} disabled={secondsLeft > 0 || checking} isLoading={sending}>
            {secondsLeft > 0 ? `Повторить через ${waitLabel(secondsLeft)}` : 'Отправить код повторно'}
          </Button>
        </div>
      ) : (
        <Button type="button" fullWidth onClick={() => void sendCode()} isLoading={sending} disabled={!validRecipient || secondsLeft > 0} leftIcon={<Icon name="phone" size={18} />}>
          {secondsLeft > 0 ? `Повторить через ${waitLabel(secondsLeft)}` : 'Отправить SMS-код'}
        </Button>
      )}
    >
      <div className={styles.container}>
        {confirmed ? (
          <div className={styles.success} role="status">
            <Icon name="check" size={24} />
            <p>Номер {phone} подтверждён.</p>
            <p>Заказ ещё не отправлен. Вернитесь к оформлению, проверьте состав и нажмите «Оформить заказ».</p>
          </div>
        ) : (
          <>
            <p className={styles.phone}>Номер для подтверждения: <strong>{phone}</strong></p>
            {smsSent ? (
              <>
                <Input
                  label="Код из SMS"
                  placeholder="Введите 6 цифр"
                  value={code}
                  onChange={event => {
                    const value = event.target.value.replace(/\D/g, '').slice(0, 6)
                    setCode(value)
                    setError('')
                    if (value.length === 6) void verifyCode(value)
                  }}
                  maxLength={6}
                  disabled={checking || sending || verifySecondsLeft > 0}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className={styles.codeInput}
                />
                <p className={styles.help} role="status">{checking ? 'Проверяем код…' : 'SMS отправлена. Введите шесть цифр из сообщения.'}</p>
              </>
            ) : <p className={styles.help}>Отправим SMS с кодом для подтверждения номера. Это не оформляет заказ.</p>}
          </>
        )}
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>
    </Modal>
  )
}
