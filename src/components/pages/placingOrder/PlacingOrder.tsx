import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import styles from './PlacingOrderStyles.module.scss'
import { Footer } from '../../footer/Footer'
import { OrderInfo } from '../blocks/orderInfo/OrderInfo'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  customerLocalDataSelector, nameSelector, phoneSelector, regModalSelector,
  setCustomerLocalData, setName, setPhone, setToken, tokenSelector, toogleModal,
} from '../../../app/slices/authSlice'
import { createOrder, creatingOrderSelector, orderErrorSelector, orderPayloadSelector } from '../../../app/slices/cartSlice'
import { formatPhoneInput, normalizePhoneNumber } from '../../../utils/other'
import { Input } from '../../common/Input'
import { Icon } from '../../common/Icon'

interface FormErrors { name?: string, phone?: string }

const savedCustomer = (value: string | null): { name?: string, phone?: string } => {
  try { return JSON.parse(value || '{}') || {} } catch { return {} }
}

export const PlacingOrder: React.FC = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(tokenSelector)
  const name = useAppSelector(nameSelector)
  const phone = useAppSelector(phoneSelector)
  const customerLocalData = useAppSelector(customerLocalDataSelector)
  const regModal = useAppSelector(regModalSelector)
  const order = useAppSelector(orderPayloadSelector)
  const isSubmitting = useAppSelector(creatingOrderSelector)
  const orderError = useAppSelector(orderErrorSelector)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const hydrated = useRef(false)
  const submitting = useRef(false)
  const cleanPhone = normalizePhoneNumber(phone)
  const verifiedPhone = normalizePhoneNumber(savedCustomer(customerLocalData).phone || '')
  const phoneConfirmed = Boolean(token && cleanPhone && verifiedPhone === cleanPhone)

  // Восстановление только при открытии страницы, не при каждом обновлении auth.
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    dispatch(setToken(Cookies.get('token') || token || ''))
    try {
      const stored = localStorage.getItem('customerLocalData')
      const customer = savedCustomer(stored)
      dispatch(setCustomerLocalData(stored))
      if (!name && customer.name) dispatch(setName(customer.name))
      if (!phone && customer.phone) dispatch(setPhone(customer.phone))
    } catch { /* Ввод остаётся доступен без localStorage. */ }
  }, [dispatch, name, phone, token])

  const validateName = (value: string): string | undefined => {
    if (!value.trim()) return 'Введите имя'
    if (value.trim().length < 2) return 'Имя слишком короткое'
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value)) return 'Используйте буквы, пробел или дефис'
    return undefined
  }
  const validatePhone = (value: string): string | undefined =>
    normalizePhoneNumber(value) ? undefined : 'Введите номер полностью. Другую страну укажите с +кодом.'
  const formReady = !validateName(name) && Boolean(cleanPhone) && order.total_amount > 0

  const handleSubmit = async () => {
    if (submitting.current || isSubmitting) return
    setTouched({ name: true, phone: true })
    const nextErrors = { name: validateName(name), phone: validatePhone(phone) }
    setErrors(nextErrors)
    if (nextErrors.name || nextErrors.phone || !cleanPhone || order.total_amount <= 0) return
    dispatch(setPhone(cleanPhone))
    if (!phoneConfirmed) {
      if (token) {
        Cookies.remove('token')
        dispatch(setToken(''))
      }
      if (!regModal) dispatch(toogleModal())
      return
    }
    const customer = JSON.stringify({ name: name.trim(), phone: cleanPhone })
    try { localStorage.setItem('customerLocalData', customer) } catch { /* Значения сохранены в Redux. */ }
    dispatch(setCustomerLocalData(customer))
    submitting.current = true
    try {
      await dispatch(createOrder({ order, token })).unwrap()
    } catch { /* Сообщение об ошибке приходит из cartSlice, поля не сбрасываются. */ }
    finally { submitting.current = false }
  }

  return (
    <>
      <div className={styles.mainWrapper}>
        <main className={styles.contentWrapper}>
          <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
            <Link to="/">Главная</Link><Icon name="chevron" size={12} /><Link to="/cart">Корзина</Link><Icon name="chevron" size={12} /><span aria-current="page">Оформление заказа</span>
          </nav>
          <header className={styles.header}>
            <h1 className="pageTitle">Оформление заказа</h1>
            <p>Проверьте получателя, получение и состав заказа перед подтверждением</p>
          </header>
          <form id="checkout-form" className={styles.content} noValidate onSubmit={event => { event.preventDefault(); void handleSubmit() }}>
            <div className={styles.leftBlock}>
              <section className={styles.formSection} aria-labelledby="recipient-heading">
                <h2 id="recipient-heading">Получатель</h2>
                <div className={styles.fields}>
                  <Input
                    label="Имя"
                    placeholder="Ваше имя"
                    value={name}
                    disabled={isSubmitting}
                    onChange={event => { dispatch(setName(event.target.value)); if (touched.name) setErrors(previous => ({ ...previous, name: validateName(event.target.value) })) }}
                    onBlur={() => { setTouched(previous => ({ ...previous, name: true })); setErrors(previous => ({ ...previous, name: validateName(name) })) }}
                    error={touched.name ? errors.name : undefined}
                    leftIcon={<Icon name="user" size={18} />}
                    required
                    autoComplete="name"
                  />
                  <Input
                    label="Телефон"
                    placeholder="+7 (999) 999-99-99"
                    value={formatPhoneInput(phone)}
                    disabled={isSubmitting}
                    onChange={event => { const value = formatPhoneInput(event.target.value); dispatch(setPhone(value)); if (touched.phone) setErrors(previous => ({ ...previous, phone: validatePhone(value) })) }}
                    onBlur={() => { if (cleanPhone) dispatch(setPhone(cleanPhone)); setTouched(previous => ({ ...previous, phone: true })); setErrors(previous => ({ ...previous, phone: validatePhone(phone) })) }}
                    error={touched.phone ? errors.phone : undefined}
                    leftIcon={<Icon name="phone" size={18} />}
                    required
                    type="tel"
                    autoComplete="tel"
                  />
                </div>
                {phoneConfirmed ? (
                  <p className={styles.confirmed} role="status"><Icon name="check" size={16} />Телефон подтверждён. Теперь можно оформить заказ.</p>
                ) : <p className={styles.helpText}>Сначала подтвердите телефон по SMS. После подтверждения нажмите «Оформить заказ».</p>}
              </section>
              <section className={styles.formSection} aria-labelledby="pickup-heading">
                <h2 id="pickup-heading">Получение</h2>
                <div className={styles.informationRow}>
                  <Icon name="pin" size={22} />
                  <div>
                    <h3>Самовывоз из магазина</h3>
                    <p>«Шинка», г. Егорьевск, ул. Рязанская<br />6 мкр-н, гаражи рядом с пожарным депо</p>
                    <p>Летом с 8:00 до 23:00. Зимой с 9:00 до 19:00.</p>
                    <a className={styles.routeLink} href="https://yandex.ru/maps/org/avto_stop/1015072993?si=4j1jcathucrm7pd2zk4jtjvukg" target="_blank" rel="noopener noreferrer">Построить маршрут <Icon name="arrow" size={14} /></a>
                  </div>
                </div>
                <p className={styles.notice}><Icon name="info" size={16} />Менеджер уточнит наличие, детали и срок получения заказа.</p>
              </section>
              <section className={styles.formSection} aria-labelledby="payment-heading">
                <h2 id="payment-heading">Оплата</h2>
                <div className={styles.informationRow}>
                  <Icon name="card" size={22} />
                  <div><h3>При получении</h3><p>Наличными или картой в пункте выдачи.</p></div>
                </div>
              </section>
              <p className={styles.legal}>Перед оформлением ознакомьтесь с <Link to="/oferta">офертой</Link> и <Link to="/police">политикой конфиденциальности</Link>.</p>
            </div>
            <aside className={styles.rightBlock}>
              {orderError && <p className={styles.error} role="alert">{orderError}</p>}
              {order.total_amount <= 0 && <p className={styles.empty}>Нет выбранных товаров. <Link to="/cart">Вернуться в корзину</Link></p>}
              <OrderInfo
                name="Ваш заказ"
                nameButton={phoneConfirmed ? 'Оформить заказ' : 'Подтвердить телефон'}
                handler={handleSubmit}
                isLoading={isSubmitting}
                disabled={!formReady}
                formId="checkout-form"
              />
            </aside>
          </form>
        </main>
        <Footer />
      </div>
    </>
  )
}
