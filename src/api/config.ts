
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

export const URLs: URLsTypes = {
    base: 'http://217.25.94.79:8000/api/v1',
    authBase: 'http://217.25.94.79:8000/auth',
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