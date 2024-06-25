// данные для фильтров
export type tiresAPI = {
    diameter: Array<string>
    goodland: Array<string | null>
    height: Array<string>
    load: Array<string>
    marka: Array<string>
    model: Array<string>
    powerload: Array<string | null>
    runflat: Array<string | null>
    seazon: Array<string>
    speed: Array<string | null>
    territory_rn: Array<string>
    thorning: Array<string>
    thorntype: Array<string | null>
    width: Array<string>
}


// содержание карточки товара
export type resultsTyresType = {
    id: number,
    article: string,
    name: string,
    name_origin: string,
    product_type: string,
    price_purchase: number,
    price_sale: number,
    image_url: string,
    image: string,
    date_add: string,
    description: string | null,
    balance: number,
    is_active: boolean,
    goodland: string,
    marka: string,
    model: string,
    seazon: string,
    diameter: string,
    width: string,
    height: string,
    thorning: string,
    speed: string,
    load: string,
    thorntype: string,
    mnfcode: string | null,
    runflat: string | null,
    powerload: string | null,
    territory_rn: string,
    provider: number
    amount: number
}


// массив карточек товара
export type tyresCards = {
    count: number | null,
    next: string | null,
    previous: string | null,
    results: Array<resultsTyresType>
}


// данные для отправки выбранных фильтров на сервер
export type fieldsTyresType = {
    width?: Array<string> | string
    height?: Array<string> | string
    diameter?: Array<string> | string
    seazon?: Array<string>
    thorning?: Array<string>
    runflat?: Array<string | null>
    powerload?: Array<string | null>
    price?: Array<number>
}


// интерфейс стейта
export interface IinitialState {
    tiresAPI: tiresAPI // данные для фильтров
    tyresCardsArr: tyresCards // данные карточек
    // фильтры
    selects: Array<{
        selectName: { apiName: string, displayName: string },
        value: string | Array<string>,
    }>
    season: Array<{ name: string, value1: string, value2: string }>
    checkboxes: Array<{ checkboxName: string, checked: boolean, value: Array<null | string> }>
    priceStart: number
    priceEnd: number
    sortType: string
}