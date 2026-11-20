import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { App } from './App'
import { makeStore } from './app/store'
import { headTags } from './seo/head'
import type { SeoPage } from './seo/pages'

export { NOT_FOUND, SEO_PAGES, SITE_ORIGIN } from './seo/pages'

export function escapeMarkup(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

export function renderPage(page: SeoPage) {
  const head = headTags(page).map(({ tag, attributes, text }) => {
    const attrs = Object.entries({ ...attributes, 'data-shinka-seo': page.path })
      .map(([name, value]) => ` ${name}="${escapeMarkup(value)}"`).join('')
    if (tag === 'meta' || tag === 'link') return `<${tag}${attrs}>`
    const body = tag === 'script' ? text : escapeMarkup(text ?? '')
    return `<${tag}${attrs}>${body}</${tag}>`
  }).join('\n    ')
  const body = renderToString(
    <Provider store={makeStore()}>
      <App prerenderPath={page.path} />
    </Provider>,
  )
  return { head, body }
}
