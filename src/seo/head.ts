import logo from '../imgs/refresh/logo-refresh.png'
import { links } from '../consts'
import { NOT_FOUND, SITE_ORIGIN, type SeoPage } from './pages'

type HeadTag = {
  tag: 'title' | 'meta' | 'link' | 'script'
  attributes?: Record<string, string>
  text?: string
}

const home = `${SITE_ORIGIN}/`
const image = new URL(logo, home).href
const storeId = `${home}#магазин`
const websiteId = `${home}#сайт`

function structuredData(page: SeoPage) {
  const url = `${SITE_ORIGIN}${page.path}`
  const graph: object[] = [
    {
      '@type': ['AutoPartsStore', 'AutoRepair'], '@id': storeId,
      name: 'Шинка88', url: home, logo: image, image,
      telephone: links[2].link.slice(4),
      address: {
        '@type': 'PostalAddress', streetAddress: 'ул. Рязанская',
        addressLocality: 'Егорьевск', addressRegion: 'Московская область', addressCountry: 'RU',
      },
    },
    { '@type': 'WebSite', '@id': websiteId, url: home, name: 'Шинка88', inLanguage: 'ru', publisher: { '@id': storeId } },
    {
      '@type': page.catalog ? 'CollectionPage' : page.path === '/aboutUs' ? 'AboutPage' : 'WebPage',
      '@id': `${url}#страница`, url, name: page.title, description: page.description,
      inLanguage: 'ru', isPartOf: { '@id': websiteId }, about: { '@id': storeId },
      ...(page.catalog ? { breadcrumb: { '@id': `${url}#навигация` } } : {}),
    },
  ]
  if (page.catalog) {
    graph.push({
      '@type': 'BreadcrumbList', '@id': `${url}#навигация`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: home },
        { '@type': 'ListItem', position: 2, name: page.label, item: url },
      ],
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function headTags(page: SeoPage): HeadTag[] {
  const url = `${SITE_ORIGIN}${page.path}`
  const meta = (name: string, content: string, property = false): HeadTag => ({
    tag: 'meta', attributes: { [property ? 'property' : 'name']: name, content },
  })
  const tags: HeadTag[] = [
    { tag: 'title', text: page.title },
    meta('description', page.description),
    meta('robots', page.index ? 'index,follow' : 'noindex,follow'),
  ]
  if (page !== NOT_FOUND) tags.push({ tag: 'link', attributes: { rel: 'canonical', href: url } })
  if (page.index) tags.push(
    meta('og:type', 'website', true),
    meta('og:locale', 'ru_RU', true),
    meta('og:site_name', 'Шинка88', true),
    meta('og:title', page.title, true),
    meta('og:description', page.description, true),
    meta('og:url', url, true),
    meta('og:image', image, true),
    meta('og:image:alt', 'Логотип магазина «Шинка88»', true),
    meta('twitter:card', 'summary'),
    meta('twitter:title', page.title),
    meta('twitter:description', page.description),
    meta('twitter:image', image),
    { tag: 'script', attributes: { type: 'application/ld+json' }, text: JSON.stringify(structuredData(page)).replaceAll('<', '\\u003c') },
  )
  return tags
}
