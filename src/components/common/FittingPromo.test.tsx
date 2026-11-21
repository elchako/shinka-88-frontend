import { cleanup, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { makeStore } from '../../app/store'
import { renderWithProviders } from '../../utils/test-utils'
import { CreateOrder } from './CreateOrderModal'

afterEach(cleanup)
it('показывает условие акции в результате после очистки корзины', () => {
  const initial = makeStore().getState()
  const store = makeStore({ ...initial, cart: { ...initial.cart, orderNumber: 123 } })
  renderWithProviders(<MemoryRouter><CreateOrder /></MemoryRouter>, { store })
  expect(screen.getByRole('dialog')).toHaveTextContent('При покупке 4 шин или 4 литых дисков')
  expect(store.getState().cart.tyres).toHaveLength(0)
})
