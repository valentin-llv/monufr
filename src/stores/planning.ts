import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

import { useUserDataStore } from "./userdata";

import Planning, { type GetAllPlanningSucces, type GetPlanningError } from "@/static/planning-downloader";
import type { PlanningEvent } from "@/static/planning-parser";

export const usePlanningStore = defineStore('planning', () => {
    // Loading infos
    const loading: Ref<boolean> = ref(true);
    const planningLoadingError: Ref<boolean> = ref(false);
    const loadingErrorCode: Ref<number> = ref(0);

    // Update infos
    const planningNotUpdated = ref(false);
    const lastPlanningUpdte = ref(new Date());

    // Planning infos
    const planning: Ref<Array<Array<PlanningEvent>>> = ref([]);
    const hiddenElements: Ref<Array<PlanningEvent>> = ref([]);
    // const downloadMethod: Ref<"download" | "cache-old"> = ref("download");

    // Vue state infos
    const currentPlanningPage = ref(0);
    const selectedEvent: Ref<PlanningEvent | undefined> = ref();
    
    async function init(): Promise<boolean> {
        let userDataStore = useUserDataStore();

        // Reset vars
        loading.value = true;
        planningLoadingError.value = false;
        planningNotUpdated.value = false;

        planning.value = [];
        selectedEvent.value = undefined;

        // User has no planning
        if(!userDataStore.planningUrls.length) return loading.value = false;

        // Preload planning from cache to allow fastest loading speed
        let preloadResult: GetAllPlanningSucces | GetPlanningError = await Planning.preloadUserPlanning(userDataStore.planningUrls);
        if(!("code" in preloadResult)) {
            planning.value = preloadResult.sortedPlanning.planning;
            hiddenElements.value = preloadResult.sortedPlanning.eventsToHide;
        }

        // Then download the update most recent planning version from the server
        let result: GetAllPlanningSucces | GetPlanningError = await Planning.downloadUserPlanning(userDataStore.planningUrls);

        loading.value = false;

        // Abort if error and save error code
        if("code" in result) {
            planningLoadingError.value = true;
            loadingErrorCode.value = result.code;

            return false;
        }

        // If result from old cache then display warning on home page
        if(result.from == "cache" && result.date instanceof Date) {
            planningNotUpdated.value = true;
            lastPlanningUpdte.value = result.date;
        }

        // Save planning
        planning.value = result.sortedPlanning.planning;
        hiddenElements.value = result.sortedPlanning.eventsToHide;

        return true;
    }

    return {
        loading,
        planningLoadingError,
        planningNotUpdated,
        lastPlanningUpdte,

        planning,
        hiddenElements,

        currentPlanningPage,
        selectedEvent,

        init,
    }
});