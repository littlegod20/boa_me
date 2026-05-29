export const PLATFORM_COMMISSION_RATE = 0.10  // 10%
export const CANCELLATION_FEE_RATE = 0.04     // 4%

export const CACHE_KEYS = {
    CATEGORIES_ALL: 'categories:all',
    CATEGORY_BY_ID: (id:string)=> `categories:${id}`,
    SERVICES_ALL: (query:string) => `services:all:${query}`,
    SERVICE_BY_ID: (id:string) => `services:${id}`,
    SERVICE_PROVIDERS: (serviceId:string) => `services:${serviceId}:providers`
}

export const CACHE_TTL = {
    CATEGORIES: 3600, // 1 hr
    SERVICES: 1800, // 30 mins
    PROVIDER_SERVICES: 600 // 10 mins
}