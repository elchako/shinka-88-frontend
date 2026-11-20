import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { headTags } from './head'
import { seoPageForPath } from './pages'

export function SeoHead() {
  const page = seoPageForPath(useLocation().pathname)
  useEffect(() => {
    const previous = document.head.querySelectorAll('[data-shinka-seo]')
    if (previous[0]?.getAttribute('data-shinka-seo') === page.path) return
    const fragment = document.createDocumentFragment()
    for (const { tag, attributes, text } of headTags(page)) {
      const element = document.createElement(tag)
      element.setAttribute('data-shinka-seo', page.path)
      for (const [name, value] of Object.entries(attributes ?? {})) element.setAttribute(name, value)
      if (text !== undefined) element.textContent = text
      fragment.append(element)
    }
    previous.forEach(element => element.remove())
    document.head.append(fragment)
  }, [page])
  return null
}
