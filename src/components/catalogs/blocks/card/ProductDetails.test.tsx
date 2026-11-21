import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../utils/test-utils'
import type { resultsTyresType } from '../../../../types/tires'
import type { resultsDisksType } from '../../../../types/disks'
import { ProductCard } from './ProductCard'

const common = { id: 1, name: 'Тестовый товар', price_sale: 1250, balance: 8, amount: 1, image_url: '/test.png', marka: 'Марка', model: 'Модель', width: '205', diameter: '16' }
const tyre = { ...common, product_type: 'Шины', seazon: 'Летняя', height: '55' } as resultsTyresType
const disk = { ...common, product_type: 'Диски', type_disk: 'Штампованный', holesquant: '5', pcd: '112' } as resultsDisksType
beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('Карточка товара', () => {
  it.each([{ data: tyre, category: 'tires' as const, expected: 'Шины' }, { data: disk, category: 'disks' as const, expected: 'Штампованный' }])('открывает данные $category по фото и закрывает Escape с возвратом фокуса', async ({ data, category, expected }) => {
    const onAdd = vi.fn()
    const { store, user, container } = renderWithProviders(<ProductCard data={data} category={category} onAdd={onAdd} />)
    const before = store.getState().cart
    const trigger = screen.getByRole('button', { name: /Подробнее о товаре/ })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog')
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(dialog.parentElement?.parentElement).toBe(document.body)
    expect(dialog).toHaveTextContent(expected)
    expect(dialog).toHaveTextContent('Марка')
    expect(dialog).not.toHaveTextContent('Страна')
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/test.png')
    expect(document.body.style.overflow).toBe('hidden')
    await user.tab()
    expect(dialog.querySelector('[tabindex="0"]')).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(store.getState().cart).toEqual(before)
    expect(onAdd).not.toHaveBeenCalled()
  })
  it('открывает по названию, закрывает крестиком и не открывает при добавлении', async () => {
    const onAdd = vi.fn()
    const { user } = renderWithProviders(<ProductCard data={tyre} category="tires" onAdd={onAdd} />)
    await user.click(screen.getByRole('button', { name: 'В корзину' }))
    expect(onAdd).toHaveBeenCalledOnce()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Тестовый товар' }))
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть модальное окно' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
