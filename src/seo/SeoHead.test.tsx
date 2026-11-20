import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter } from 'react-router-dom'
import { afterEach, expect, test } from 'vitest'
import { SeoHead } from './SeoHead'
import { SEO_PAGES, SITE_ORIGIN, seoPageForPath } from './pages'

afterEach(() => {
  cleanup()
  document.head.querySelectorAll('[data-shinka-seo]').forEach(element => element.remove())
})

test('navigation updates canonical and indexing rules without duplicating server or client tags', async () => {
  render(<MemoryRouter initialEntries={['/tires?utm_source=fixture']}>
    <SeoHead />
    <Link to="/disks">Диски</Link>
    <Link to="/cart">Корзина</Link>
    <Link to="/unavailable">Нет страницы</Link>
  </MemoryRouter>)
  const canonical = () => document.head.querySelector('link[rel=canonical]')?.getAttribute('href')
  const robots = () => document.head.querySelector('meta[name=robots]')?.getAttribute('content')
  const user = userEvent.setup()
  expect(canonical()).toBe(`${SITE_ORIGIN}/tires`)
  expect(robots()).toBe('index,follow')
  expect(document.title).toContain('Купить шины в Егорьевске')
  await user.click(screen.getByRole('link', { name: 'Диски' }))
  expect(canonical()).toBe(`${SITE_ORIGIN}/disks`)
  expect(document.title).toContain('Купить колёсные диски в Егорьевске')
  for (const selector of ['title', 'link[rel=canonical]', 'meta[name=description]', 'script[type="application/ld+json"]']) {
    expect(document.head.querySelectorAll(selector)).toHaveLength(1)
  }
  await user.click(screen.getByRole('link', { name: 'Корзина' }))
  expect(canonical()).toBe(`${SITE_ORIGIN}/cart`)
  expect(robots()).toBe('noindex,follow')
  expect(document.head.querySelector('script[type="application/ld+json"]')).toBeNull()
  await user.click(screen.getByRole('link', { name: 'Нет страницы' }))
  expect(canonical()).toBeUndefined()
  expect(robots()).toBe('noindex,follow')
})

test('sitemap source contains only unique useful pages with distinct metadata', () => {
  const indexed = SEO_PAGES.filter(page => page.index)
  expect(indexed.map(page => page.path)).toEqual(['/', '/tires', '/disks', '/aboutUs', '/purchaser', '/services'])
  for (const key of ['path', 'title', 'description'] as const) {
    expect(new Set(SEO_PAGES.map(page => page[key])).size).toBe(SEO_PAGES.length)
  }
  expect(seoPageForPath('/tires/').path).toBe('/tires')
  expect(seoPageForPath('/TIRES').path).toBe('/404')
})
