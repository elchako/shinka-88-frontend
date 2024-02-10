import type {AxiosInstance} from "axios"
import axios from "axios"
import {URLs} from './config'

class CatalogAPI {
    instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({baseURL})
    }

    async getProducts(){
        const response = await this.instance.post('iana-timezones')
        return response.data.data.map((data:any) => ({ value: data, label: data }))
    }
}

export const catalogApi = new CatalogAPI(URLs.base)