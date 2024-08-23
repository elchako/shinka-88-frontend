import { type resultsDisksType } from "./disks"
import { type resultsTyresType } from "./tires"

// дополнительные поля для карточек товара в корзине
export type selectedType = {
    canceled: boolean
    queue: number
}

type orderViewType = {
    id: number
    quantity: number
    price: number
}

// оформленный заказ
export type orderProductsType = {
    tyres?: Array<orderViewType>
    disks?: Array<orderViewType>
}

export type orderType = {
    total_amount: number
    order_items: orderProductsType
}


// интерфейс стейта
export interface IinitialState {
    priceAmount: number
    queueCounter: number
    selectAll: boolean
    tyres: Array<selectedType & resultsTyresType>
    disks: Array<selectedType & resultsDisksType>
    creatingOrder: boolean
    orderNumber: number
}


// массив всех данных для карточек товара в корзине
export type commonArrDataType = ((selectedType & resultsTyresType) | (selectedType & resultsDisksType))[]
