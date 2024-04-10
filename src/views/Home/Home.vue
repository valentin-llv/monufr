<template>
    <div>
        <div class="relative mb-6 pt-4">
            <HeaderSmall class="color-900"> Bonjour 👋 </HeaderSmall>
            <Header class="mt-2 color-900"> On est le <span class="color-accent"> {{ new Date().getDate() }} {{ DateManager.getMonthsName()[new Date().getMonth()] }} </span>&nbsp;📅 </Header>
        
            <router-link to="/settings" class="absolute left-full -translate-x-full top-0">
                <Settings class="h-18 aspect-square" />
            </router-link>
        </div>

        <!-- No wifi -->
        <div v-if="!socketConnected && displayWifiWarning" class="rounded-3xl bg-red-400 flex flex-col p-6 mb-6">
            <div class="flex items-center gap-6">
                <NoInternet class="w-14" />
                <Text class="flex-1 color-900"> Vous êtes hors ligne </Text>
            </div>

            <Text class="flex-1 mt-6 color-900"> 
                Certaines fonctionnalités sont momentanément indisponible. 
            </Text>
        </div>

        <!-- First time message -->
        <router-link to="/new-planning">
            <div v-if=displayMessages[1] class="rounded-3xl bg-200 p-6 mb-6">
                <Text class="color-900">
                    Bienvenue sur l'application MonUFR !
                    <br /><br />
                    Comme vous venez d'arriver, tout est encore bien vide ici.
                    <br /><br />
                    Pourquoi ne pas commencer par <span class="color-accent">ajouter un emploi du temps</span>, cliquez ici !
                </Text>
            </div>
        </router-link>

        <router-link to="/new-planning">
            <div v-if=displayMessages[1] class="rounded-3xl bg-200 p-6 mb-6 flex flex-col gap-4">
                <Text class="color-900 flex-1 text-"> Etape 2 : Ajouter un emploi du temps </Text>

                <div class="w-full h-10 rounded-full bg-300">
                    <div class="w-[50%] h-10 rounded-full bg-accent">
                        <Text class="color-900 scale-90 pt-0.5 ml-1">50%</Text>
                    </div>
                </div>
            </div>
        </router-link>

        <!-- New update message -->
        <!-- <div v-if=!displayMessages.includes(true) class="rounded-3xl bg-accent-gradient p-6 mb-6">
            <HeaderSmall class="color-900 !text-4xl"> Nouveautées sur MonUFR </HeaderSmall>

            <Text class="color-900 mt-4">
                Un nouvel onglet est desormais disponible: la bibliothèque.
                <br /><br />
                Sauvegardez vos notes textuelles, creez des mails de contacts pour vos profs, sauvegardez les liens des cours et bien plus.
                <br /><br />
                Un nouveau menu fait aussi son apparition, effectuez un appui long sur un evenement pour essayer.
            </Text>
        </div> -->

        <DownloadApp class="app-hidden-tx3708" /> <!-- Hide for iOS --> 

        <!-- Specials -->
        <div v-if=!displayMessages[1] v-for="specialName, index in specialNames" class="app-hidden-tx3708"> <!-- Hide for iOS --> 
            <div v-if="specialName == city">
                <component :is=specials[index] class="flex-1" />
            </div>
        </div>

        <!-- Next class -->
        <div class="mb-6">
            <HeaderSmall v-if="nextClass && nextClass.now" class="color-900"> Cours actuel: </HeaderSmall>
            <HeaderSmall v-if="nextClass && !nextClass.now" class="color-900">  Prochain cours dans: {{ nextClass.timeTo }} </HeaderSmall>
            <HeaderSmall v-if="loading && !nextClass" class="color-900"> Prochain cours </HeaderSmall>

            <ClassEvent v-if="nextClass" :event=nextClass.event />

            <div class="overflow-x-hidden">
                <EventLoader v-if="loading && !nextClass" class="mt-4" />
            </div>
        </div>

        <!-- Do work reminder -->
        <div v-if="featuresEnabled.prepareClass && (loading || workToDo.length)" class="rounded-3xl bg-200 p-6 mb-6 flex flex-col gap-6">
            <Text v-if="DateManager.getDayNumber(new Date()) == 5 || (DateManager.getDayNumber(new Date()) == 4 && new Date().getHours() >= 19)" class="color-900">
                Cours à préparer pour lundi:
            </Text>
            <Text v-else-if="new Date().getHours() >= 19 || DateManager.getDayNumber(new Date()) != 6" class="color-900">
                Cours à préparer pour demain:
            </Text>
            <Text v-else class="color-900">
                Cours à préparer pour aujourd'hui:
            </Text>
            
            <Text v-if="planning.length && !workToDo.length" class="color-900 bg-300 flex-1 flex flex-row p-6 rounded-2xl items-center">
                Felicitation, vous avez preparé tout vos cours.
                <br /><br />
                Vous pouvez aller vous reposez !
            </Text>

            <div v-if="loading" class="relative box-loading box-loading-light bg-300 flex-1 p-24 rounded-2xl overflow-hidden"></div>

            <div v-if="!loading && workToDo.length" class="flex-1 flex flex-col gap-3">
                <ClassEvent v-for="event in workToDo" :event=event :small=true />
            </div>
        </div>

        <!-- Share reminder -->
        <div class="rounded-3xl bg-200 p-6 mb-6 flex flex-col gap-6">
            <Text class="color-900"> Partager à vos amis </Text>

            <router-link to="/settings/share/app" class="bg-300 flex-1 flex flex-row p-6 rounded-2xl items-center">
                <Phone class="h-16" />
                <Text class="color-900 ml-6"> Partager l'application </Text>
            </router-link>

            <router-link to="/settings/share/planning" class="bg-300 flex-1 flex flex-row p-6 rounded-2xl items-center">
                <Calendar class="h-16 stroke-900 fill-900" />
                <Text class="color-900 ml-6"> Partager votre emploi du temps </Text>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, shallowRef, type Ref } from 'vue';
    import { storeToRefs } from 'pinia';

    import { useUserDataStore, type Cities } from '@/stores/userdata';
    import { usePlanningStore } from '@/stores/planning';
    import { usePwaStore } from '@/stores/pwa';

    import { socketConnected } from '@/socket/socket';

    import type { PlanningEvent } from '@/static/planning-parser';

    import DateManager from '@/static/date-manager';
    import Utils from '@/static/utils';

    import ClassEvent from '@/components/planning/ClassEvent.vue';
    import EventLoader from '@/components/planning/EventLoader.vue';

    import SorbonnePolytech from '@/views/Home/Specials/SorbonnePolytech.vue';
    import ToursPolytech from '@/views/Home/Specials/ToursPolytech.vue';
    import Gobelins from './Specials/Gobelins.vue';
    import MontpellierPolytech from './Specials/MontpellierPolytech.vue';

    import DownloadApp from './messages/DownloadApp.vue';

    import Text from '@/ui/text/Text.vue';
    import HeaderSmall from '@/ui/text/HeaderSmall.vue';
    import Header from '@/ui/text/Header.vue';

    import Calendar from '@/assets/icons/Calendar.vue';
    import NoInternet from '@/assets/icons/NoInternet.vue';
    import Settings from '@/assets/icons/Settings.vue';
    import Phone from '@/assets/icons/Phone.vue';

    const { installOnIosSeen, city, classPrepared, featuresEnabled, planningUrls } = storeToRefs(useUserDataStore());
    const { planning, loading } = storeToRefs(usePlanningStore());
    const { updateInstalled, newUpdate, canInstall } = storeToRefs(usePwaStore());

    const specialNames: Ref<Array<Cities>> = ref(["Paris, Polytech Sorbonne", "Tours, Polytech", "Paris, Gobelins", "Montpellier, Polytech"]);
    const specials = shallowRef([SorbonnePolytech, ToursPolytech, Gobelins, MontpellierPolytech]);

    const displayWifiWarning = ref(false);
    setTimeout(() => {
        displayWifiWarning.value = true;
    }, 5000);

    const displayMessages = computed(() => {
        return [
            canInstall.value,
            !planningUrls.value.length,
            newUpdate.value && !canInstall.value,
            updateInstalled.value && !canInstall.value,
            Utils.isIOS() && !installOnIosSeen.value,
        ]
    });

    const nextClass: Ref<NextClass | false> = computed(() => {
        if(planning.value.length != 0) {
            let today = new Date();

            for(let j = 0; j < planning.value.length; j++) {
                if(DateManager.getDateText(planning.value[j][0].start) == DateManager.getDateText(today)) {
                    for(let i = 0; i < planning.value[j].length; i++) {
                        if(planning.value[j][i].end.getTime() < Date.now()) continue;
                        else if(planning.value[j][i].start.getTime() < Date.now()) {
                            return { // Current class
                                event: planning.value[j][i],
                                now: true,
                                timeTo: "",
                            }
                        } else {
                            return { // Next class
                                event: planning.value[j][i],
                                now: false,
                                timeTo: DateManager.getHourText(new Date(planning.value[j][i].start.getTime() - Date.now() - 1000 * 60 * 60)),
                            }
                        }
                    }
                }
            }

            return false;
        } else return false;
    });

    const workToDo = computed(() => {
        if(planning.value.length != 0) {
            let today = new Date();
            let classToPrepare = [];

            let workForNextDayCount = 0;
            if(today.getHours() >= 19 && DateManager.getDayNumber(today) == 4) workForNextDayCount = 3;
            else if(DateManager.getDayNumber(today) == 5) workForNextDayCount = 2;
            else if(DateManager.getDayNumber(today) == 6 || today.getHours() >= 19) workForNextDayCount = 1;

            let targetDate = new Date();
            targetDate.setDate(today.getDate() + workForNextDayCount);
            for(let j = 0; j < planning.value.length; j++) {
                if(DateManager.getDateText(planning.value[j][0].start) == DateManager.getDateText(targetDate)) {
                    for(let i = 0; i < planning.value[j].length; i++) {
                        if(!classPrepared.value.includes(planning.value[j][i].uid)) {
                            classToPrepare.push(planning.value[j][i]);
                        }
                    }
                }
            }

            return classToPrepare;
        } else return [];
    });

    interface NextClass {
        event: PlanningEvent,
        now: boolean,
        timeTo: string,
    }
</script>

<style scoped>

</style>