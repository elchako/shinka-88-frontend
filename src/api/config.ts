interface URLsTypes {
    base: string,
    authBase: string
    filters: {
        tyres: string,
        disks: string,
        filteredTyres: string,
        filteredDisks: string
    }
    auth: {
        register: string
        login: string
    }
    order: string
}

// В production по умолчанию прежний домен; для изолированного стенда задайте VITE_API_ORIGIN.
const baseURL = (import.meta.env.VITE_API_ORIGIN || 'https://xn--88-6kc5akr9e.xn--p1ai').replace(/\/$/, '')


export const URLs: URLsTypes = {
    base: `${baseURL}/api/v1`,
    authBase: `${baseURL}/auth`,
    filters: {
        tyres: '/filter/tyre',
        disks: '/filter/disk',
        filteredTyres: '/tyre/',
        filteredDisks: '/disk/'
    },
    auth: {
        register: '/sms/',
        login: '/sms/verify/'
    },
    order: '/order/'
}