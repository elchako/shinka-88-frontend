import type { AxiosInstance } from "axios"
import axios from "axios"
import { URLs } from './config'
import { type fieldsTyresType } from "../components/pages/main/blocks/filters/filtersBlocks/filterBlock1Slice";
import { type fieldsDiskType } from "../components/pages/main/blocks/filters/filtersBlocks/filterBlock2Slice";

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

    async getFilteredTyres(fields: fieldsTyresType, order_by: string, url: string | null) {
        let path
        url ? path = `${URLs.filters.filteredTyres}?${url}` : path = URLs.filters.filteredTyres
        const response = await this.instance.post(path, JSON.stringify({ fields, order_by }), {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data
    }

    async getFilteredDisks(fields: fieldsDiskType, order_by: string, url: string | null) {
        let path
        url ? path = `${URLs.filters.filteredDisks}?${url}` : path = URLs.filters.filteredDisks
        const response = await this.instance.post(path, JSON.stringify({ fields, order_by }), {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data
    }
}

export const filtersApi = new FiltersAPI(URLs.base)