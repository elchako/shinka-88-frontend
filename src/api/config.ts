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

//const baseURL = 'https://xn--88-6kc5akr9e.xn--p1ai'
const baseURL = 'http://127.0.0.1:8000'


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