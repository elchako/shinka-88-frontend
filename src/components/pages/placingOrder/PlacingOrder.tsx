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
import {
  cartSignatureSelector, createOrder, creatingOrderSelector, hydrateOrderIntent, orderHydratingSelector,
  orderIssueSelector, orderPayloadSelector, setCheckoutCustomer, startNewOrderIntent,
} from '../../../app/slices/cartSlice'
import { CHECKOUT_RECEIPT_PREFIX, CHECKOUT_STORAGE_PREFIX, orderRecovery } from '../../../utils/orderIntent'
import type { OrderFailure } from '../../../api/order'
import { links } from '../../../consts'
import { Button } from '../../common/Button'
import { formatPhoneInput, normalizePhoneNumber } from '../../../utils/other'
import { Input } from '../../common/Input'
import { Icon } from '../../common/Icon'
import { FittingPromo } from '../../common/FittingPromo'

interface FormErrors { name?: string, phone?: string }

const issueMessage = (issue: OrderFailure): string => {
  switch (issue.code) {
    case 'order_pending': return 'Заявка уже обрабатывается или ожидает сверки. Повторная отправка заблокирована. Свяжитесь с магазином и сообщите номер заявки.'
    case 'order_requires_review': return 'Результат отправки требует сверки с поставщиком. Не оформляйте новый заказ. Свяжитесь с магазином и сообщите номер заявки.'
    case 'price_changed': return 'Цена или сумма изменились. Вернитесь в корзину, сверьте цены в каталоге и заново добавьте изменившиеся позиции. Автоматически цены не менялись.'
    case 'product_unavailable': return 'Товар недоступен в нужном количестве. Вернитесь в корзину и перепроверьте наличие в каталоге. Товары не удалены автоматически.'
    case 'amount_limit': return 'Сумма превышает допустимый предел. Проверьте состав в корзине или свяжитесь с магазином.'
    case 'mixed_warehouses': return 'Товары с разных складов нужно оформить отдельно. Свяжитесь с магазином для подбора состава заказа. Автоматического разделения заказа или удаления товаров не было.'
    case 'cart_contains_confirmed': return 'В этой вкладке остались позиции из уже подтверждённого заказа. Не отправляйте их повторно. Вернитесь в корзину и сверьте состав с указанным заказом либо свяжитесь с магазином.'
    case 'cart_storage_conflict': return 'Заказ подтверждён, но корзина одновременно менялась в другой вкладке и не все локальные изменения удалось сохранить. Новая отправка заблокирована. Не закрывайте страницу; сверьте оставшиеся товары с магазином.'
    case 'invalid_order': case 'invalid_idempotency_key': case 'cart_changed': return 'Проверьте состав, количества и суммы в корзине перед новым оформлением. Ваши товары и контакты сохранены.'
    case 'supplier_rejected': return 'Поставщик отклонил оформление. Заявка сохранена для проверки. Корзина и контакты на месте. После проверки можно явно начать новое оформление.'
    case 'network_error': return 'Ответ на запрос не получен. Результат заказа пока неизвестен. Можно повторить только этот же запрос с прежним ключом. Не создавайте новый заказ; если состав изменился, свяжитесь с магазином.'
    case 'orders_unavailable': return 'Оформление временно недоступно. Результат не подтверждён. Повтор допускается только с тем же составом и ключом; при сомнении свяжитесь с магазином.'
    case 'authentication_required': case 'customer_not_verified': return 'Подтвердите телефон заново. Корзина и контакты сохранены; после входа ключ этого запроса останется прежним.'
    case 'storage_unavailable': return 'Не удалось безопасно сохранить ключ заказа. Новая отправка не выполнялась. Проверьте разрешение на хранение данных и обновите браузер/страницу либо свяжитесь с магазином. Если предыдущая заявка уже была, уточните её результат в магазине. Корзина и контакты остаются на экране.'
    case 'storage_after_send': return 'Ответ получен, но не удалось сохранить результат в браузере. Не отправляйте новый заказ. Свяжитесь с магазином для сверки; корзина не очищена.'
    case 'browser_busy': return 'Оформление уже выполняется в другой вкладке. Повторная отправка заблокирована. Дождитесь результата в той вкладке или свяжитесь с магазином.'
    case 'client_intent_conflict': return 'Состав отличается от заявки с неизвестным результатом. Новый заказ заблокирован до сверки с магазином. Корзина и контакты сохранены.'
    case 'idempotency_conflict': return 'Ключ заявки уже связан с другим составом. Повторная отправка заблокирована. Свяжитесь с магазином для сверки.'
    default: return 'Получен неожиданный ответ. Успех заказа не подтверждён. Повторная отправка заблокирована до сверки с магазином.'
  }
}

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
  const orderIssue = useAppSelector(orderIssueSelector)
  const isHydrating = useAppSelector(orderHydratingSelector)
  const signature = useAppSelector(cartSignatureSelector)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const hydrated = useRef(false)
  const submitting = useRef(false)
  const cleanPhone = normalizePhoneNumber(phone)
  const verifiedPhone = normalizePhoneNumber(savedCustomer(customerLocalData).phone || '')
  const phoneConfirmed = Boolean(token && cleanPhone && verifiedPhone === cleanPhone)
  const identity = phoneConfirmed && cleanPhone ? cleanPhone : ''
  const recovery = orderIssue ? orderRecovery(orderIssue) : null
  const blocked = Boolean(recovery && !['retry', 'auth'].includes(recovery))
  const needsVerification = !phoneConfirmed || recovery === 'auth'
  const contact = links.find(link => link.link.startsWith('tel:'))

  useEffect(() => {
    dispatch(setCheckoutCustomer(identity))
    if (!identity) return
    const args = { customer: identity, order, cartSignature: signature }
    void dispatch(hydrateOrderIntent(args))
    const changedInAnotherTab = (event: StorageEvent) => {
      if (event.key === null || event.key.startsWith(CHECKOUT_STORAGE_PREFIX) || event.key.startsWith(CHECKOUT_RECEIPT_PREFIX)) void dispatch(hydrateOrderIntent(args))
    }
    window.addEventListener('storage', changedInAnotherTab)
    return () => window.removeEventListener('storage', changedInAnotherTab)
  }, [dispatch, identity, order, signature])

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
    if (submitting.current || isSubmitting || isHydrating || blocked) return
    setTouched({ name: true, phone: true })
    const nextErrors = { name: validateName(name), phone: validatePhone(phone) }
    setErrors(nextErrors)
    if (nextErrors.name || nextErrors.phone || !cleanPhone || order.total_amount <= 0) return
    dispatch(setPhone(cleanPhone))
    if (needsVerification) {
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
      await dispatch(createOrder({ order, token, customer: cleanPhone })).unwrap()
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
                {!needsVerification ? (
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
              <FittingPromo />
              <p className={styles.legal}>Перед оформлением ознакомьтесь с <Link to="/oferta">офертой</Link> и <Link to="/police">политикой конфиденциальности</Link>.</p>
            </div>
            <aside className={styles.rightBlock}>
              {orderIssue && <div className={styles.error} role="alert">
                {orderIssue.reference && <p className={styles.reference}>Номер заявки: {orderIssue.reference}</p>}
                <p>{issueMessage(orderIssue)}</p>
                <div className={styles.recoveryLinks}>
                  {(recovery === 'cart' || recovery === 'new' || orderIssue.code === 'cart_contains_confirmed') && <Link to="/cart">Вернуться в корзину</Link>}
                  {contact ? <a href={contact.link}>Связаться с магазином</a> : <Link to="/aboutUs">Связаться с магазином</Link>}
                </div>
                {(recovery === 'cart' || recovery === 'new') && <Button
                  type="button" variant="outline" fullWidth disabled={isSubmitting || isHydrating || !identity || !formReady}
                  onClick={() => { if (identity) void dispatch(startNewOrderIntent({ customer: identity, order, cartSignature: signature })) }}
                >{recovery === 'cart' ? 'Корзина проверена, начать заново' : 'Начать новое оформление'}</Button>}
              </div>}
              {order.total_amount <= 0 && <p className={styles.empty}>Нет выбранных товаров. <Link to="/cart">Вернуться в корзину</Link></p>}
              <OrderInfo
                name="Ваш заказ"
                nameButton={needsVerification ? 'Подтвердить телефон' : recovery === 'retry' ? 'Повторить тот же запрос' : 'Оформить заказ'}
                handler={handleSubmit}
                isLoading={isSubmitting}
                disabled={!formReady || blocked || isHydrating}
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
