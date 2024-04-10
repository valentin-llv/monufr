<template>
    <div class="flex flex-col">
        <div class="flex-1 overflow-auto pb-6">
            <!-- Display event date + event -->
            <div v-for="day in planning">
                <HeaderSmall class="mt-10 color-900"> 
                    {{ DateManager.getDaysName()[day[0].start.getDay()] }}&nbsp;{{ day[0].start.getDate() }}&nbsp;{{ DateManager.getMonthsName()[day[0].start.getMonth()] }} 
                </HeaderSmall>

                <ClassEvent v-for="event in day" :event=event />
            </div>

            <!-- Add planning button start -->
            <router-link to="/new-planning" v-if="!loading && planningUrls.length == 0">
                <div class="absolute top-1/2 -translate-y-1/2 w-full mt-24">
                    <Text class="text-center color-900"> Vous n'avez pas d'emploi du temps. Il est peut-etre temps d'en ajouter un. </Text>

                    <div class="bg-accent p-6 rounded-3xl text-center mt-6">
                        <Text class="color-900"> Ajouter un emploi du temps </Text>
                    </div>
                </div>
            </router-link>

            <!-- Empty planing -->
            <div v-if="planning.length == 0 && !loading && planningUrls.length > 0 && !planningLoadingError" class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-min">
                <NoClassIcon class="w-96" />
                <Text class="text-center color-900 mt-10"> Votre emploi du temps est vide </Text>
            </div>

            <!-- Loader-->
            <div v-if="loading" class="mt-20 overflow-x-hidden">
                <EventLoader v-for="index in 3" class="mt-4" />
            </div>

            <!-- Loading error -->
            <div v-if="!loading && planningLoadingError" class="absolute top-1/2 -translate-y-1/2 w-full mt-24">
                <Text class="text-center color-900"> Une erreur est survenue lors du chargement de l'emploi du temps ! </Text>

                <div class="bg-accent p-6 rounded-3xl text-center mt-6" @click="usePlanningStore().init()">
                    <Text class="color-900"> Réessayer </Text>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { storeToRefs } from 'pinia';

    import { usePlanningStore } from '@/stores/planning';
    import { useUserDataStore } from '@/stores/userdata';

    import DateManager from '@/static/date-manager';

    import NoClassIcon from '@/assets/icons/NoClassIcon.vue';

    import ClassEvent from '@/components/planning/ClassEvent.vue';
    import EventLoader from '@/components/planning/EventLoader.vue';

    import Text from '@/ui/text/Text.vue';
    import HeaderSmall from '@/ui/text/HeaderSmall.vue';

    const { planning, loading, planningLoadingError } = storeToRefs(usePlanningStore());
    const { planningUrls } = storeToRefs(useUserDataStore());
</script>@/static/date-manager