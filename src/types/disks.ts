// данные для фильтров
export type diskResponseData = {
    type_disk: Array<string>
    goodland: Array<string>
    marka: Array<null>
    model: Array<string | null>
    diameter: Array<string>
    width: Array<string>
    holesquant: Array<string>
    pcd: Array<string>
    wheeloffset: Array<string>
    dia: Array<string | null>
    color: Array<string | null>
    processway: Array<string | null>
    territory_rn: Array<string>
    provider: Array<string>
}

export type disksAPI = {
    max_price: number
    min_price: number
    response_data: diskResponseData
}


// содержание карточки товара
export type resultsDisksType = {
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
    type_disk: string
    goodland: string,
    marka: string,
    model: string,
    diameter: string,
    width: string,
    holesquant: string,
    pcd: string,
    wheeloffset: string,
    dia: string,
    color: string,
    processway: string,
    mnfcode: string | null,
    territory_rn: string,
    provider: number
    amount: number
}


// массив карточек товара
export type disksCards = {
    count: number | null,
    next: string | null,
    previous: string | null,
    results: Array<resultsDisksType>
}


// данные для отправки выбранных фильтров на сервер
export type fieldsDiskType = {
    diameter?: string | Array<string>
    pcd?: string | Array<string>
    type_disk?: string | Array<string>
    price?: Array<number>
}


// интерфейс стейта фильтров
export interface IinitialState {
    disksAPI: disksAPI // данные для фильтров
    disksCardsArr: disksCards // данные карточек
    // фильтры
    selects: Array<{
        selectName: { apiName: string, displayName: string },
        value: string | Array<string>,
    }>
    sortType: string
    priceStart: number
    priceEnd: number
    priceMin: number
    priceMax: number
}