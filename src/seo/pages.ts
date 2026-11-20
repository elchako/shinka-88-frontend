export const SITE_ORIGIN = 'https://xn--88-6kc5akr9e.xn--p1ai'

export interface SeoPage {
  path: string
  title: string
  description: string
  label: string
  index: boolean
  catalog?: boolean
}

export const SEO_PAGES: SeoPage[] = [
  {
    path: '/', label: 'Главная', index: true,
    title: 'Шины и диски в Егорьевске — магазин «Шинка88»',
    description: 'Шины и колёсные диски в Егорьевске: подбор по параметрам, цены и остатки в каталоге. Магазин и шиномонтаж «Шинка88» на улице Рязанской, ГСК ЦЕНА.',
  },
  {
    path: '/tires', label: 'Шины', index: true, catalog: true,
    title: 'Купить шины в Егорьевске — каталог «Шинка88»',
    description: 'Каталог шин в Егорьевске: летние, зимние и всесезонные. Подберите шины по ширине, профилю и диаметру, сравните цены за штуку и проверьте остатки.',
  },
  {
    path: '/disks', label: 'Диски', index: true, catalog: true,
    title: 'Купить колёсные диски в Егорьевске — «Шинка88»',
    description: 'Каталог колёсных дисков в Егорьевске: подбор по диаметру, креплению PCD и типу. Сравните цены за штуку, наличие и параметры дисков перед покупкой.',
  },
  {
    path: '/aboutUs', label: 'О магазине', index: true,
    title: 'Магазин шин и шиномонтаж в Егорьевске — «Шинка88»',
    description: 'О магазине «Шинка88» в Егорьевске: шины, колёсные диски и шиномонтаж. Адрес магазина, телефон и маршрут на улице Рязанской, ГСК ЦЕНА.',
  },
  {
    path: '/purchaser', label: 'Покупателю', index: true,
    title: 'Информация о покупке шин и дисков — «Шинка88»',
    description: 'Информация покупателю шин и дисков в магазине «Шинка88»: условия оплаты, получения, гарантии и возврата. Егорьевск, улица Рязанская, ГСК ЦЕНА.',
  },
  { path: '/oferta', label: 'Оферта', index: false, title: 'Публичная оферта — «Шинка88»', description: 'Условия публичной оферты магазина «Шинка88».' },
  { path: '/police', label: 'Политика конфиденциальности', index: false, title: 'Политика конфиденциальности — «Шинка88»', description: 'Политика обработки персональных данных магазина «Шинка88».' },
  { path: '/autoParts', label: 'Автозапчасти', index: false, title: 'Автозапчасти — «Шинка88»', description: 'Информация о разделе автозапчастей. Онлайн-поиск в разделе пока недоступен.' },
  { path: '/cart', label: 'Корзина', index: false, title: 'Корзина — «Шинка88»', description: 'Корзина магазина «Шинка88».' },
  { path: '/placing_order', label: 'Оформление заказа', index: false, title: 'Оформление заказа — «Шинка88»', description: 'Оформление заказа в магазине «Шинка88».' },
]

export const NOT_FOUND: SeoPage = {
  path: '/404', label: 'Страница не найдена', index: false,
  title: 'Страница не найдена — «Шинка88»', description: 'Попробуйте перейти в каталог шин или колёсных дисков.',
}

const byPath = new Map(SEO_PAGES.map(page => [page.path, page]))

export function seoPageForPath(pathname: string): SeoPage {
  return byPath.get(pathname.replace(/\/+$/, '') || '/') ?? NOT_FOUND
}
