import type { AxiosInstance } from "axios"
import axios from "axios"
import { URLs } from './config'

class FiltersAPI {
    instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({ baseURL })
    }

    async getTyres() {
        const response = await this.instance.get(URLs.filters.tyres)
        return response.data
    }

    async getDisks() {
        const response = await this.instance.get(URLs.filters.disks)
        return response.data
    }

    async getFilteredTyres(fields: any = {}) {
        const response = await this.instance.post(URLs.filters.filteredTyres, JSON.stringify({ fields }), {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data
    }
}

export const filtersApi = new FiltersAPI(URLs.base)