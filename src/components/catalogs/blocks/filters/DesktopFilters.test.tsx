import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../utils/test-utils'
import { DesktopFilters } from './DesktopFilters'

const renderFilters = (min: number | null, max: number | null) => renderWithProviders(
  <DesktopFilters filterBlocks={<div />} commonFilters={{
    resetFiltersAction: vi.fn(() => ({ type: 'test/reset' })),
    priceSetter: vi.fn(() => ({ type: 'test/price' })),
    priceStartNumber: 0,
    priceEndNumber: 0,
    priceMinNumber: min,
    priceMaxNumber: max,
  }} />
)

describe('Ценовые фильтры каталога', () => {
  it('показывает От/До, а не null для пустого каталога', () => {
    renderFilters(null, null)
    expect(screen.getByPlaceholderText('От')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('До')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('null')).not.toBeInTheDocument()
  })

  it('сохраняет реальные границы цены, если они есть', () => {
    renderFilters(100, 500)
    expect(screen.getByPlaceholderText('100')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('500')).toBeInTheDocument()
  })
})
