<template>
    <div class="overflow-x-hidden pb-0">
        <!-- Top elements / Greetings -->
        <div class="relative mb-6 pt-4">
            <HeaderSmall v-if="planningUrls.length > 0" class="color-900"> 
                Vous avez <span class="color-accent">{{ numberClassToday }}&nbsp;cours</span>&nbsp;📗<br />{{ numberOfClassDayName }}&nbsp;! 
            </HeaderSmall>

            <HeaderSmall class="color-900" v-if="planningUrls.length == 0">
                Vous n'avez pas encore <br /> ajouté d'emploi du temps.
            </HeaderSmall>

            <router-link to="/settings/planning-feature" class="absolute left-full top-0 -translate-x-full">
                <Settings class="h-18 aspect-square" />
            </router-link>
        </div>

        <!-- View navigator start -->
        <div class="flex overflow-x-auto -ml-6 -mr-6 pl-6 pr-6 gap-4 whitespace-nowrap">
            <div v-for="tabName, index in tabsNames" @click=changeTab(index)>
                <Text class="color-900 p-5 pl-8 pr-8 rounded-full bg-200 duration-300" :class="{ 'bg-accent': currentPlanningPage == index }">
                    {{ tabName }} 
                </Text>
            </div>
        </div>

        <!-- Empty planning alert -->
        <div v-if="!planning.length && !loading && !planningLoadingError && planningUrls.length > 0" class="rounded-3xl bg-accent p-6 mt-6">
            <Text class="color-900">
                Tout vos emploi du temps sont vide. Leurs periode d'export doit être arrivé à expiration, pensez les ajouter a nouveau.
            </Text>
        </div>

        <!-- Using cached planning alert -->
        <div v-if="planning.length && !loading && planningNotUpdated && planningUrls.length > 0" class="rounded-3xl bg-accent p-6 mt-6">
            <Text class="color-900">
                Impossible de télécharger votre emploi du temps. Il se peut que celui-ci ne soit pas à jour.
                <br /><br />
                Derniere mise à jour: {{ DateManager.getDateText(lastPlanningUpdte).slice(0, -5) }}
            </Text>
        </div>

        <!-- Planning url expire soon -->
        <div v-if="planning && planning[planning.length - 1] && planning[planning.length - 1][0].start.getTime() - 1000 * 60 * 60 * 24 * 7 < Date.now()" class="rounded-3xl bg-accent p-6 mt-6">
            <Text class="color-900">
                Attention l'export de votre emploi du temps arrive à expiration. 
                <br />
                N'oubliez pas de l'ajouter à nouveau dans l'application.
            </Text>
        </div>

        <!-- Views start -->
        <div class="relative flex-1 mt-6">
            <div v-for="tabName, index in tabsNames">
                <transition :name=tabTransitionName>
                    <div v-if="currentPlanningPage == index" :class="{ 'pb-28': loading }" class="absolute left-0 top-0 w-full h-full flex">
                        <component :is=tabs[index] class="flex-1" />
                    </div>
                </transition>
            </div>

            <transition name="fade">
                <div v-if="loading" class="absolute top-full -translate-y-full -mt-6 w-full rounded-3xl bg-300 p-6 duration-200 justify-center flex flex-row gap-6">
                    <SpinningRing />

                    <Text class="color-900">
                        Mise à jour de l'emploi du temps
                    </Text>
                </div>
            </transition>
        </div>

        <!-- Add event -->
        <!-- <div v-if="planningUrls.length > 0" class="absolute top-full left-full -translate-x-full -translate-y-full -mt-7 -ml-7 bg-accent rounded-3xl p-4">
            <AddIcon class="h-20" />
        </div> -->
    </div>
</template>

<script setup lang="ts">
    import { shallowRef, computed, ref } from 'vue';

    import { storeToRefs } from 'pinia';

    import { usePlanningStore } from '@/stores/planning';
    import { useUserDataStore } from '@/stores/userdata';

    import DateManager from '@/static/date-manager';

    import SpinningRing from '@/components/animations/SpinningRing.vue';

    import Week from './PlanningViews/Week.vue';
    import All from './PlanningViews/All.vue';
    import Search from './PlanningViews/Search.vue';

    import Text from '@/ui/text/Text.vue';
    import HeaderSmall from '@/ui/text/HeaderSmall.vue';

    import Settings from '@/assets/icons/Settings.vue';

    const { planning, loading, planningLoadingError, planningNotUpdated, lastPlanningUpdte, currentPlanningPage } = storeToRefs(usePlanningStore());
    const { planningUrls } = storeToRefs(useUserDataStore());

    const tabsNames = ref(["Ma semaine", "Mon planning", "Rechercher"]);
    const tabs = shallowRef([Week, All, Search]);

    const tabTransitionName = ref('');

    const numberOfClassDayName = ref("");
    const numberClassToday = computed(() => {
        const today = new Date();

        if(DateManager.getDayNumber(new Date()) == 5)  {
            today.setDate(today.getDate() + 2);
            numberOfClassDayName.value = "lundi";
        } else if(planning.value.length && planning.value[0].slice(-1)[0].end.getHours() + 1 <= today.getHours()) {
            today.setDate(today.getDate() + 1);
            numberOfClassDayName.value = "demain";
        } else numberOfClassDayName.value = "aujourd'hui";

        let todayString = today.toDateString();
        
        for(let i = 0; i < planning.value.length; i++) {
            if(planning.value[i][0].start.toDateString() == todayString) {
                return planning.value[i].length;
            }
        }

        return 0;
    });

    let currentTabIndex = currentPlanningPage.value;
    function changeTab(newTabIndex: number) {
        if(newTabIndex > currentTabIndex) tabTransitionName.value = 'slide-in-full';
        else tabTransitionName.value = 'slide-out-full';

        currentPlanningPage.value = newTabIndex;
        currentTabIndex = newTabIndex;
    }
</script>@/static/date-manager