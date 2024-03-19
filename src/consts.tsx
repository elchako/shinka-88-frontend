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
        title: 'ШИНЫ',
        link: 'tires'
    }, {
        title: 'ДИСКИ',
        link: 'disks'
    }, {
        title: 'МАСЛА',
        link: 'oils'
    }, {
        title: 'АКБ',
        link: 'akb'
    }, {
        title: 'АВТОЗАПЧАСТИ',
        link: 'autoParts'
    }, {
        title: 'ШИНОМОНТАЖ',
        link: 'tireFitting'
    }, {
        title: 'АВТОСЕРВИС',
        link: 'carService'
    },
    {
        title: 'Оформление заказа',
        link: 'placing_order'
    },{
        title: 'Оплата',
        link: 'payment'
    },{
        title: 'О нас',
        link: 'aboutUs'
    },{
        title: 'Гарантии',
        link: 'guarantees'
    },
]

// фильтры на главной странице
export const tabs: Array<string> = ['Шины', 'Диски', 'Масла', 'АКБ', 'Автозапчасти']
export const tabsButtons: Array<string> = ['Подобрать шины', 'Подобрать диски', 'Подобрать масла',
    'Подобрать АКБ', 'Подобрать автозапчасти']
export const selectsNames1: Array<string> = ['Ширина', 'Высота', 'Диаметр', 'Производитель']
export const selectsNames1_2: Array<string> = ['Марка', 'Модель', 'Год выпуска', 'Модификация']
export const selectsNames2: Array<string> = ['Диаметр', 'Крепление', 'Тип', 'Производитель']
export const selectsNames3: Array<string> = ['Объём', 'Вязкость', 'Состав', 'Бренд']
export const selectsNames4: Array<string> = ['Размер ДхШхВ', 'Полярность', 'Емкость', 'Производитель']
export const typeSelectsValues: Array<string> = ['parametrs-select', 'auto-select']
export const typeSelectsText: Array<string> = ['Подбор по параметрам', 'Подбор по автомобилю']
export const filterButtons: Array<string> = ['все', 'зима, шипы', 'зима, без шипов', 'лето']
export const checkboxesNames: Array<string> = ['RunFlat', 'Усиленные', 'Бесплатный шиномонтаж']

// каталог шин
export const sorts: Array<string> = ['Дешевле', 'Дороже'] // сортировка