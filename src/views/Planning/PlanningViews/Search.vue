<template>
    <div class="flex flex-col">
        <!-- Search bar -->
        <input @keyup.enter=blur v-model.trim=search class="outline-none rounded-3xl bg-200 p-5 mb-6 leading-3 text-4xl font-medium color-900" type="text" placeholder="Algèbre ..." />

        <div class="flex-1 flex flex-col overflow-hidden relative">
            <!-- Display the event date + event-->
            <div v-if="searchResult.length > 0" class="flex-1 flex flex-col overflow-y-auto pb-6 -mt-6">
                <div v-for="day in searchResult">
                    <HeaderSmall class="mt-10 color-900"> 
                        {{ DateManager.getDaysName()[day[0].start.getDay()] }}&nbsp;{{ day[0].start.getDate() }}&nbsp;{{ DateManager.getMonthsName()[day[0].start.getMonth()] }} 
                    </HeaderSmall>
                    
                    <ClassEvent v-for="event in day" :event="event" />
                </div>
            </div>

            <!-- No result -->
            <div v-if="searchResult.length == 0 && !loading && !planningLoadingError && planningUrls.length > 0" class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-min">
                <NoResultIconVue class="w-96" />
                <Text class="text-center color-900 mt-10"> Aucun cours ne correspond a votre recherche </Text>
            </div>

            <!-- Add planning button start -->
            <router-link to="/new-planning" v-if="!loading && planningUrls.length == 0">
                <div class="absolute top-1/2 -translate-y-1/2 w-full mt-12">
                    <Text class="text-center color-900"> Vous n'avez pas d'emploi du temps. Il est peut-etre temps d'en ajouter un. </Text>

                    <div class="bg-accent p-6 rounded-3xl text-center mt-6">
                        <Text class="color-900"> Ajouter un emploi du temps </Text>
                    </div>
                </div>
            </router-link>

            <!-- Loading error-->
            <div v-if="!loading && planningLoadingError" class="absolute top-1/2 -translate-y-1/2 w-full mt-12">
                <Text class="text-center color-900"> Une erreur est survenue lors du chargement de l'emploi du temps ! </Text>

                <div class="bg-accent p-6 rounded-3xl text-center mt-6" @click="usePlanningStore().init()">
                    <Text class="color-900"> Réessayer </Text>
                </div>
            </div>

            <!-- Loader-->
            <div v-if="loading" class="overflow-x-hidden mt-20">
                <EventLoader v-for="index in 3" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { storeToRefs } from 'pinia';

    import DateManager from '@/static/date-manager';

    import { usePlanningStore } from '@/stores/planning';
    import { useUserDataStore } from '@/stores/userdata';

    import ClassEvent from '@/components/planning/ClassEvent.vue';
    import EventLoader from '@/components/planning/EventLoader.vue';

    import Text from '@/ui/text/Text.vue';
    import HeaderSmall from '@/ui/text/HeaderSmall.vue';

    import NoResultIconVue from '@/assets/icons/NoResultIcon.vue';

    const { planning, loading, planningLoadingError } = storeToRefs(usePlanningStore());
    const { planningUrls } = storeToRefs(useUserDataStore());

    const todayMorning = ref(new Date());
    todayMorning.value.setHours(0);

    const search = ref("");
    const searchResult = computed(() => {
        let searchResult = JSON.parse(JSON.stringify(planning.value));

        for(let j = 0; j < searchResult.length; j++) {
            for(let i = 0; i < searchResult[j].length; i++) {
                searchResult[j][i].start = new Date(searchResult[j][i].start);
                searchResult[j][i].end = new Date(searchResult[j][i].end);

                let searchCriteria = [
                    searchResult[j][i].summary.toLowerCase().includes(search.value.toLowerCase()),
                    searchResult[j][i].teacher.toLowerCase().includes(search.value.toLowerCase()),
                    searchResult[j][i].location.toLowerCase().includes(search.value.toLowerCase()),
                ];

                if(!searchCriteria.includes(true) || searchResult[j][i].start.getTime() < todayMorning.value.getTime()) {
                    searchResult[j].splice(i, 1);
                    i -= 1;

                    if(searchResult[j].length == 0) {
                        searchResult.splice(j, 1);
                        j -= 1;
                        break;
                    }
                }
            }
        }

        return searchResult;
    });

    function blur(event: any) { event.target.blur(); }
</script>

<style scoped>

</style>@/static/date-manager