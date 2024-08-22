import type { AxiosInstance } from "axios"
import axios from "axios"
import { URLs } from './config'

class AuthAPI {
    instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({ baseURL })
    }

    async getSmsCode(name: string, phone_number: string) {
        await this.instance.post(URLs.auth.register,
            JSON.stringify({ name, phone_number }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async login(phone_number: string, confirmation_code: string) {
        const response = await this.instance.post(URLs.auth.login,
            JSON.stringify({ phone_number, confirmation_code }), {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data
    }
}

export const authApi = new AuthAPI(URLs.authBase)