import type { AxiosInstance } from "axios"
import axios from "axios"
import { URLs } from './config'

class AuthAPI {
    instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({ baseURL })
    }

    async getToken(name: string, phone_number: string) {
        const response = await this.instance.post(URLs.auth.register,
            JSON.stringify({ name, phone_number }), {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data
    }

    async login() {
        const response = await this.instance.get(URLs.auth.login)
        return response.data
    }
}

export const authApi = new AuthAPI(URLs.authBase)