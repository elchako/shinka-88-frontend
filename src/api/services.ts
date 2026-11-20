import axios from 'axios'
import { URLs } from './config'

export interface StoreService {
  id: number
  name: string
  description: string
  price: string | null
  unit: string
}
export interface ServiceGroup {
  id: number
  name: string
  description: string
  items: StoreService[]
}
export const servicesApi = {
  async get(signal?: AbortSignal): Promise<{ groups: ServiceGroup[] }> {
    const response = await axios.get<{ groups: ServiceGroup[] }>(`${URLs.base}/services/`, { signal })
    if (!Array.isArray(response.data.groups)) throw new Error('Некорректный ответ прайса')
    return response.data
  },
}
