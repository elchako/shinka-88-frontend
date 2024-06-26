import { type resultsDisksType } from "./disks"
import { type resultsTyresType } from "./tires"

// дополнительные поля для карточек товара в корзине
export type selectedType = {
    canceled: boolean
    queue: number
}


// интерфейс стейта
export interface IinitialState {
    priceAmount: number
    queueCounter: number
    selectAll: boolean
    tyres: Array<selectedType & resultsTyresType>
    disks: Array<selectedType & resultsDisksType>
}


// массив всех данных для карточек товара в корзине
export type commonArrDataType = ((selectedType & resultsTyresType) | (selectedType & resultsDisksType))[]
