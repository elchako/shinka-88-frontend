import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { QuantityStepper } from './QuantityStepper'

function Counter({ max }: { max: number }) {
  const [value, setValue] = useState(1)
  return <QuantityStepper value={value} max={max} label="Шина" onDecrease={() => setValue(v => v - 1)} onIncrease={() => setValue(v => v + 1)} />
}

afterEach(() => vi.useRealTimers())

describe('понятный предел остатков', () => {
  it.each([1, 2, 3, 4, 10])('объясняет предел %s шт. и не увеличивает количество', max => {
    render(<Counter max={max} />)
    const group = screen.getByRole('group', { name: 'Количество: Шина' })
    const plus = within(group).getByRole('button', { name: 'Увеличить количество: Шина' })
    expect(within(group).getByText(`Доступно: ${max} шт.`)).toBeInTheDocument()
    for (let i = 1; i < max; i++) fireEvent.click(plus)
    expect(plus).toHaveAttribute('aria-disabled', 'true')
    expect(plus).not.toBeDisabled()
    fireEvent.click(plus)
    expect(within(group).getByRole('status', { name: 'Доступность товара' })).toHaveTextContent(`Доступно только ${max} шт.`)
    expect(within(group).getByLabelText('Выбрано штук')).toHaveTextContent(String(max))
  })

  it('пояснение исчезает без очереди уведомлений и изменения количества', () => {
    vi.useFakeTimers()
    render(<Counter max={1} />)
    const plus = screen.getByRole('button', { name: 'Увеличить количество: Шина' })
    fireEvent.click(plus)
    fireEvent.click(plus)
    expect(screen.getAllByRole('status', { name: 'Доступность товара' })).toHaveLength(1)
    act(() => vi.advanceTimersByTime(2600))
    expect(screen.getByRole('status', { name: 'Доступность товара' })).toHaveTextContent('Доступно: 1 шт.')
  })

  it('убирает пояснение после уменьшения и снова разрешает увеличение', () => {
    render(<Counter max={2} />)
    const plus = screen.getByRole('button', { name: 'Увеличить количество: Шина' })
    fireEvent.click(plus)
    fireEvent.click(plus)
    fireEvent.click(screen.getByRole('button', { name: 'Уменьшить количество: Шина' }))
    expect(screen.getByRole('status', { name: 'Доступность товара' })).toHaveTextContent('Доступно: 2 шт.')
    expect(plus).toHaveAttribute('aria-disabled', 'false')
  })

  it('очищает таймер при удалении карточки', () => {
    vi.useFakeTimers()
    const { unmount } = render(<Counter max={1} />)
    fireEvent.click(screen.getByRole('button', { name: 'Увеличить количество: Шина' }))
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
