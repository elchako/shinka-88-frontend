//ссылки
export const links: Array<{ title: string, link: string }> = [
    {
        title: 'Главная',
        link: '/'
    },
    {
        title: 'Корзина',
        link: 'cart'
    },
    {
        title: '+7 (919) 772 88 88',
        link: 'tel:+79197728888'
    },
    {
        title: 'Шины',
        link: 'tires'
    }, {
        title: 'Диски',
        link: 'disks'
    }, {
        title: 'масла',
        link: 'oils'
    }, {
        title: 'АКБ',
        link: 'akb'
    }, {
        title: 'Автозапчасти',
        link: 'autoParts'
    }, {
        title: 'Шиномонтаж',
        link: 'tireFitting'
    }, {
        title: 'Автосервис',
        link: 'carService'
    },
    {
        title: 'Оформление заказа',
        link: 'placing_order'
    }, {
        title: 'Политика конфиденциальности',
        link: 'police'
    }, {
        title: 'О нас',
        link: 'aboutUs'
    }, {
        title: 'Оферта',
        link: 'oferta'
    }, {
        title: 'Покупателю',
        link: 'purchaser'
    },
]

// фильтры на главной странице
export const tabs: Array<string> = ['Шины', 'Диски'] // ['Масла', 'АКБ', 'Автозапчасти']
export const tabsButtons: Array<string> = ['Подобрать шины', 'Подобрать диски'] //['Подобрать масла', 'Подобрать АКБ', 'Подобрать автозапчасти']
export const selectsNames1: Array<{ apiName: string, displayName: string }> = [
    { apiName: 'width', displayName: 'Ширина' },
    { apiName: 'height', displayName: 'Высота' },
    { apiName: 'diameter', displayName: 'Диаметр' },
    // { apiName: 'goodland', displayName: 'Производитель' }]
]
export const selectsNames1_2: Array<{ apiName: string, displayName: string }> = [
    { apiName: 'marka', displayName: 'Марка' },
    { apiName: 'model', displayName: 'Модель' },
    { apiName: 'year', displayName: 'Год выпуска' },
    { apiName: 'modification', displayName: 'Модификация' }]
export const selectsNames2: Array<{ apiName: string, displayName: string }> = [
    { apiName: 'diameter', displayName: 'Диаметр' },
    { apiName: 'pcd', displayName: 'Крепление' },
    { apiName: 'type_disk', displayName: 'Тип' }]
export const selectsNames3: Array<string> = ['Объём', 'Вязкость', 'Состав', 'Бренд']
export const selectsNames4: Array<string> = ['Размер ДхШхВ', 'Полярность', 'Емкость', 'Производитель']
export const typeSelectsValues: Array<string> = ['parametrs-select', 'auto-select']
export const typeSelectsText: Array<string> = ['Подбор по параметрам', 'Подбор по автомобилю']
export const filterButtons: Array<{ name: string, value1: string, value2: string }> =
    [{ name: 'все', value1: 'Ш.,н/ш.,_', value2: 'Всесезонная,Зимняя,Летняя' },
    { name: 'зима, шипы', value1: 'Ш.', value2: 'Зимняя' },
    { name: 'зима, без шипов', value1: 'н/ш.', value2: 'Зимняя' },
    { name: 'лето', value1: '_', value2: 'Летняя' }]
export const checkboxesNames: Array<string> = ['RunFlat', 'Усиленные', 'Бесплатный шиномонтаж']

// каталоги
export const catalogsTitles: Array<string> = ['Каталог шин', 'Каталог дисков',]

// каталог шин
export const sorts: Array<string> = ['Дешевле', 'Дороже'] // сортировка