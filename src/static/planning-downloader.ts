import { useUserDataStore, type PlanningInfos } from "@/stores/userdata";
import { usePlanningStore } from "@/stores/planning";

import Utils from "./utils";
import CacheManager, { type CacheError, type JsonData } from "./cache-manager";
import type { DownloadRessourceError, DownloadRessourceSucces } from "./download-manager";
import DownloadManager from "./download-manager";
import type { PlanningEvent, RowEvent, SortedPlanning } from "./planning-parser";
import PlanningParser from "./planning-parser";

export default class PlanningDownloader {
    static async preloadUserPlanning(urls: Array<PlanningInfos>): Promise<GetAllPlanningSucces | GetPlanningError> {
        let unOrderedEvents: Array<PlanningEvent> = [];
        for(let i = 0; i < urls.length; i++) {
            let rowPlanningString: JsonData | CacheError = await CacheManager.searchIncache(urls[i].url, false);

            if("code" in rowPlanningString) return {
                code: rowPlanningString.code
            }

            let rowEvents: Array<RowEvent> = PlanningParser.parseRowPlanningFile(rowPlanningString.data);
            let parsedEvents: Array<PlanningEvent> = PlanningParser.parseEvents(rowEvents);
            unOrderedEvents = unOrderedEvents.concat(parsedEvents);
        }

        let sortedPlanning: SortedPlanning = PlanningParser.orderEvents(unOrderedEvents);

        return {
            sortedPlanning: sortedPlanning,
            from: "cache",
            date: new Date(),
        }
    }

    static async downloadUserPlanning(urls: Array<PlanningInfos>): Promise<GetAllPlanningSucces | GetPlanningError> {
        let cacheDate: Date = new Date();
        let downloadMethod: "download" | "cache" = "download";

        let unOrderedEvents: Array<PlanningEvent> = [];
        for(let i = 0; i < urls.length; i++) {
            let rowPlanningString: GetPlanningSucces | GetPlanningError = await this.getRowPlanning(urls[i].url);

            if("code" in rowPlanningString) return {
                code: rowPlanningString.code,
            }

            if(rowPlanningString.from == "cache") {
                downloadMethod = "cache";
                if(rowPlanningString.date && cacheDate.getTime() > rowPlanningString.date.getTime()) cacheDate = rowPlanningString.date;
            }

            let rowEvents: Array<RowEvent> = PlanningParser.parseRowPlanningFile(rowPlanningString.content);
            let parsedEvents: Array<PlanningEvent> = PlanningParser.parseEvents(rowEvents);
            unOrderedEvents = unOrderedEvents.concat(parsedEvents);
        }

        let sortedPlanning: SortedPlanning = PlanningParser.orderEvents(unOrderedEvents);

        return {
            sortedPlanning: sortedPlanning,
            from: downloadMethod,
            ...(cacheDate ? { date : cacheDate } : {})
        }
    }

    static getRowPlanning(url: string): Promise<GetPlanningSucces | GetPlanningError> {
        return new Promise(async (resolve) => {
            // Check first in cache with timeout on
            let cacheResult = await CacheManager.searchIncache(url, true);

            if(!("code" in cacheResult)) return resolve({
                from: "download",
                content: cacheResult.data,
            });

            // Then tries to download
            let downloadResult: DownloadRessourceSucces | DownloadRessourceError = await DownloadManager.downloadRowPlanning(url);

            if(!("code" in downloadResult)) {
                CacheManager.cacheData(url, downloadResult.content);

                return resolve({
                    from: "download",
                    content: downloadResult.content,
                });
            }

            // Then check in cache with no ressource timeout
            let noTimeOutResult = await CacheManager.searchIncache(url, false);

            if(!("code" in noTimeOutResult)) return resolve({
                from: "cache",
                content: noTimeOutResult.data,
                date: new Date(noTimeOutResult.date),
            });

            return resolve({
                code: 6 // Impossible to get the requested ressource
            });
        });
    }

    static async addPlanning(url: string) {
        if(url == '') return {
            msg: "Veuillez saisir une url !"
        }

        if(!Utils.isValidUrl(url)) return {
            msg: "L'url n'est pas valide"
        }

        let userDataStore = useUserDataStore();

        for(let i = 0; i < userDataStore.planningUrls.length; i++) {
            if(userDataStore.planningUrls[i].url == url) return {
                msg: "Ce planning a déjà été ajouté"
            }
        }

        console.log("test0");

        let downloadResult = await this.getRowPlanning(url);

        if("code" in downloadResult) {
            if(downloadResult.code == 2) return {
                msg: "Hum, il semblerai que l'url saisie soit erroné. Veuillez vérifier la saisie."
            }
            else return {
                msg: "La connexion au server est actuellement imposible, veuillez réessayer dans quelques secondes."
            }
        }

        let rowEvents: Array<RowEvent> = PlanningParser.parseRowPlanningFile(downloadResult.content);
        let parsedEvents: Array<PlanningEvent> = PlanningParser.parseEvents(rowEvents);
        let sortedPlanning: SortedPlanning = PlanningParser.orderEvents(parsedEvents);

        if(sortedPlanning.planning.length == 0) return {
            msg: "Ce planning est vide ! Vérifiez que vous bien sélectionné la periode d'export."
        }

        userDataStore.planningUrls.push({
            date: new Date(),
            url: url,
        });
        usePlanningStore().init();

        return {};
    }
}

export interface GetPlanningSucces {
    content: string,
    from: "download" | "cache",
    date?: Date,
}

export interface GetPlanningError {
    code: 1 | 2 | 3 | 4 | 5 | 6 | 7,
}

export interface GetAllPlanningSucces {
    sortedPlanning: SortedPlanning,
    from: "download" | "cache",
    date?: Date,
}