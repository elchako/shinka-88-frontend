import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { PromoBanner } from './PromoBanner'

test('баннер сохраняет согласованный текст и условие только для шин и литых дисков', () => {
  render(<PromoBanner />)

  expect(screen.getByRole('heading', { level: 2, name: 'Шиномонтаж и балансировка бесплатно' })).toBeInTheDocument()
  expect(screen.getByText(/При покупке/)).toHaveTextContent('При покупке 4 шин или литых дисков')
  expect(screen.getByText('Снятие колёс включено')).toBeInTheDocument()
  expect(screen.getByText(/На рынке с/)).toHaveTextContent('На рынке с 2001 года')
  expect(screen.queryByText(/штампован/i)).not.toBeInTheDocument()
})

test('весь баннер ведёт к подбору и сообщает условия доступным именем', () => {
  const { container } = render(<PromoBanner />)
  const link = screen.getByRole('link', { name: /Шиномонтаж и балансировка бесплатно при покупке 4 шин или литых дисков\. Снятие колёс включено\./ })

  expect(link).toHaveAttribute('href', '#product-picker')
  expect(screen.getByText('Подобрать комплект')).toBeInTheDocument()
  expect(container.querySelector('img')).toHaveAttribute('alt', '')
  expect(container.querySelector('img')).toHaveAttribute('fetchpriority', 'high')
  expect(container.querySelector('div[aria-hidden="true"] svg')).toBeInTheDocument()
  expect(container.querySelectorAll('h2')).toHaveLength(1)
})
