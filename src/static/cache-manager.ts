import globalVars from "./globalVars";

export default class CacheManager {
    static searchIncache(url: string, timeOutCheck: boolean): Promise<JsonData | CacheError> {
        return new Promise(async (resolve) => {
            if(!('serviceWorker' in navigator)) return resolve({
                code: 1 // Service worker not available, cache API is not activated
            });
            
            return caches.open(globalVars.appCacheName).then((cache) => {
                return cache.match(url).then(async (data) => {
                    if(!data) return resolve({
                        code: 4, // Ressource not found
                    });

                    let jsonData: JsonData = await data.json();

                    if(timeOutCheck && jsonData.date + 1000 * 60 * 10 < Date.now()) return resolve({
                        code: 5 // Ressource outdated
                    });
                    else resolve(jsonData);
                }).catch(() => { resolve({
                    code: 3 // An error occured while searching in cache
                }); });
            }).catch(() => { resolve({
                code: 2 // Unable to open cache
            }); });
        });
    }

    static async cacheData(url: string, data: Object): Promise<boolean> {
        let fakeResponse = this.createFakeFetchResponse(url, data);

        if(!('serviceWorker' in navigator)) return false;

        return await caches.open(globalVars.appCacheName).then((cache) => {
            cache.put(url, fakeResponse);
            return true;
        }).catch(() => {
            return false;
        });
    }

    static createFakeFetchResponse(url: string, data: Object): Response {
        let jsonData = JSON.stringify({
            date: Date.now(),
            data: data,
        });

        let blob = new Blob([jsonData], { type: "application/json" });

        let responseStatus = { "status": 200 , "statusText": url };
        return new Response(blob, responseStatus);
    }
}

export interface JsonData {
    date: number,
    data: string,
}

export interface CacheError {
    code: 1 | 2 | 3 | 4 | 5,
}