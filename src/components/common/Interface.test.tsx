import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'
import { Modal } from './Modal'
import { Price } from './Price'
import { QuantityStepper } from './QuantityStepper'

describe('общие элементы лёгкого оформления', () => {
  it('сохраняет связь label/input при перерисовке и показывает inline error', () => {
    const { rerender } = render(<Input label="Имя получателя" leftIcon={<span>icon</span>} />)
    const first = screen.getByLabelText('Имя получателя')
    const id = first.id
    rerender(<Input label="Имя получателя" leftIcon={<span>icon</span>} error="Введите имя" />)
    expect(screen.getByLabelText('Имя получателя').id).toBe(id)
    expect(screen.getByRole('alert')).toHaveTextContent('Введите имя')
    expect(screen.getByLabelText('Имя получателя')).toHaveAttribute('aria-describedby', `${id}-error`)
  })

  it('не теряет реальные копейки при форматировании цены', () => {
    const { container } = render(<Price value={15249.5} />)
    expect(container.textContent?.replace(/\s/g, '')).toBe('15249,50₽')
  })

  it('не навязывает дробную часть целой цене', () => {
    const { container } = render(<Price value={6480} />)
    expect(container.textContent?.replace(/\s/g, '')).toBe('6480₽')
  })

  it('даёт доступные границы количества и callbacks', () => {
    const decrease=vi.fn(),increase=vi.fn()
    const { rerender } = render(<QuantityStepper value={1} max={4} onDecrease={decrease} onIncrease={increase} label="Шина" />)
    expect(screen.getByRole('button', { name: 'Уменьшить количество: Шина' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Увеличить количество: Шина' }))
    expect(increase).toHaveBeenCalledTimes(1)
    rerender(<QuantityStepper value={4} max={4} onDecrease={decrease} onIncrease={increase} label="Шина" />)
    expect(screen.getByRole('button', { name: 'Увеличить количество: Шина' })).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Увеличить количество: Шина' }))
    expect(increase).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status', { name: 'Доступность товара' })).toHaveTextContent('Доступно только 4 шт.')
  })

  it('не сбрасывает фокус поля при изменении onClose и вызывает актуальный callback', () => {
    const first=vi.fn(),second=vi.fn()
    const { rerender } = render(<Modal isOpen onClose={first} title="Подтверждение"><input aria-label="Код" /></Modal>)
    const input=screen.getByLabelText('Код')
    expect(input).toHaveFocus()
    rerender(<Modal isOpen onClose={second} title="Подтверждение"><input aria-label="Код" /></Modal>)
    expect(input).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(second).toHaveBeenCalledTimes(1)
    expect(first).not.toHaveBeenCalled()
  })

  it('закрывает Escape только верхний диалог и восстанавливает scroll lock', () => {
    document.body.style.overflow='auto'
    const first=vi.fn(),second=vi.fn()
    const { unmount } = render(<><Modal isOpen onClose={first} title="Первый"><button>Действие</button></Modal><Modal isOpen onClose={second} title="Второй"><button>Другое действие</button></Modal></>)
    const dialogs=screen.getAllByRole('dialog')
    expect(dialogs[0].getAttribute('aria-labelledby')).not.toBe(dialogs[1].getAttribute('aria-labelledby'))
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(second).toHaveBeenCalledTimes(1)
    expect(first).not.toHaveBeenCalled()
    unmount()
    expect(document.body.style.overflow).toBe('auto')
    document.body.style.overflow=''
  })
})
