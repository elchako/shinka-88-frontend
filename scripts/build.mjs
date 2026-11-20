import { log } from 'node:console'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { build } from 'vite'

const { values } = parseArgs({ options: { outDir: { type: 'string', default: 'dist' } } })
const outDir = resolve(values.outDir)
// Keep the server bundle separate from browser output and able to resolve node_modules.
const stage = await mkdtemp(resolve('node_modules', '.shinka-prerender-'))
try {
  await build({ build: { outDir } })
  await build({
    build: {
      ssr: 'src/entry-prerender.tsx', outDir: stage, copyPublicDir: false,
      rollupOptions: { output: { entryFileNames: 'render.mjs' } },
    },
  })
  const { renderPage, escapeMarkup, SEO_PAGES, NOT_FOUND, SITE_ORIGIN } = await import(pathToFileURL(join(stage, 'render.mjs')).href)
  const template = await readFile(join(outDir, 'index.html'), 'utf8')
  for (const marker of ['<!--shinka-head-->', '<!--shinka-body-->']) {
    if (template.split(marker).length !== 2) throw new Error(`Expected one build marker ${marker}`)
  }
  for (const page of [...SEO_PAGES, NOT_FOUND]) {
    const { head, body } = renderPage(page)
    if ((body.match(/<h1(?:\s|>)/g) ?? []).length !== 1) throw new Error(`Expected one rendered H1: ${page.path}`)
    const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`
    const html = template.replace('<!--shinka-head-->', () => head).replace('<!--shinka-body-->', () => body)
    await writeFile(join(outDir, file), html)
  }
  const urls = SEO_PAGES.filter(page => page.index)
    .map(page => `  <url><loc>${escapeMarkup(`${SITE_ORIGIN}${page.path}`)}</loc></url>`).join('\n')
  await writeFile(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
  await writeFile(join(outDir, 'robots.txt'), [
    'User-agent: *', 'Disallow: /admin/', 'Disallow: /auth/', 'Disallow: /api/docs/',
    'Disallow: /api/schema/', 'Disallow: /api/v1/order/', '', `Sitemap: ${SITE_ORIGIN}/sitemap.xml`, '',
  ].join('\n'))
  log(`Prerendered ${SEO_PAGES.length + 1} HTML pages, robots.txt and sitemap.xml.`)
} finally {
  await rm(stage, { recursive: true, force: true })
}
