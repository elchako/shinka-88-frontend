import type { AxiosInstance } from "axios"
import axios from "axios"
import { URLs } from './config'
import type { orderType } from "../types/cart";

class OrderAPI {
    instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({ baseURL })
    }

    async createOrder(order: orderType, token: string) {
        try {
            const response = await this.instance.post(URLs.order,
                JSON.stringify(order), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
            return response.data
        } catch (error) {
            // Проверяем, если ошибка является ошибкой от axios
            if (axios.isAxiosError(error)) {
                // Читаем детали ошибки
                return error.response?.data
            }
        }
    }
}

export const orderApi = new OrderAPI(URLs.base)