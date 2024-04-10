<template>
    <div class="flex flex-col">
        <!-- Weekday selector start -->
        <div class="weekday-selector w-full h-28 relative overflow-hidden">
            <TransitionGroup :name=weekChangeAnim>
                <div v-for="day, index in selectedWeekDays" :key="day.number" :style="{ 'transition': ('margin-top 0.3s linear ' + (15 * index) + 'ms' + ', opacity 400ms') }" @click="weekDaySelected = index">
                    <div class="bg-200 rounded-2xl pt-3 pb-3 duration-300" :class="{ 'bg-accent': (weekDaySelected == index) }">
                        <Text class="text-center color-900 scale-75"> {{ day.nameShort }} </Text>
                        <Text class="text-center color-900 scale-110 mt-1.5"> {{ day.number }} </Text>
                    </div>
                </div>
            </TransitionGroup>
        </div>

        <!-- Date navigator start -->
        <div class="flex items-center mt-3">
            <BackwardArrow class="h-16 aspect-square" @click=previousWeek />

            <HeaderSmall class="flex-1 text-center color-900 scale-95">
                {{ selectedWeekDays[0].monthName + " " + selectedWeekDays[0].year }} 
            </HeaderSmall>

            <ForwardArrow class="h-16 aspect-square" @click=nextWeek />
        </div>

        <div class="relative flex-1 mt-2 overflow-auto pb-6">
            <!-- Display today events-->
            <div class="relative" v-if="currentDayContentIndex.found">
                <!-- <TransitionGroup name="fadet"> -->
                    <ClassEvent v-for="event, index in planning[currentDayContentIndex.index]" :event=event :key=event.uid />
                <!-- </TransitionGroup> -->
            </div>

            <!-- Easter egg -->
            <div @click=unlockValentinesTheme class="special-theme2 w-full p-6 rounded-3xl mt-5" v-if="!featuresEnabled.specialColorThemes['easterEgg2'] && selectedWeekDays[0].monthName == 'Février' && selectedWeekDays[weekDaySelected].number == 14">
                <Text class="color-900"> Débloquer le thème spécial Saint Valentin&nbsp;🌹 </Text>
            </div>

            <!-- No class today-->
            <div v-if="!currentDayContentIndex.found && !loading && planningUrls.length > 0 && !planningLoadingError" class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-min">
                <!-- Easter egg -->
                <div class="flex flex-col gap-10 items-center" v-if="selectedWeekDays[0].monthName == 'Juillet' && selectedWeekDays[weekDaySelected].number == 17">
                    <Text class="!text-8xl"> 🎂 </Text>
                    <Text class="color-900 !font-bold"> 17&nbsp;juillet </Text>
                </div>

                <div v-else>
                    <NoClassIcon class="w-96" />
                    <Text class="text-center color-900 mt-10"> Aucun cours ce jour </Text>
                </div>
            </div>

            <!-- Add planning button start -->
            <router-link to="/new-planning" v-if="planningUrls.length == 0">
                <div class="absolute top-1/2 -translate-y-1/2 w-full">
                    <Text class="text-center color-900"> Vous n'avez pas d'emploi du temps. Il est peut-etre temps d'en ajouter un. </Text>

                    <div class="bg-accent p-6 rounded-3xl text-center mt-6">
                        <Text class="color-900"> Ajouter un emploi du temps </Text>
                    </div>
                </div>
            </router-link>

            <!-- Loader-->
            <div v-if="loading && !currentDayContentIndex.found" class="overflow-x-hidden mt-4">
                <EventLoader v-for="index in 3" />
            </div>

            <!-- Loading error-->
            <div v-if="planningLoadingError" class="absolute top-1/2 -translate-y-1/2 w-full">
                <Text class="text-center color-900"> Une erreur est survenue lors du chargement de l'emploi du temps ! </Text>

                <div class="bg-accent p-6 rounded-3xl text-center mt-6" @click="usePlanningStore().init()">
                    <Text class="color-900"> Réessayer </Text>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { storeToRefs } from 'pinia';

    import { usePlanningStore } from '@/stores/planning';
    import { useUserDataStore } from '@/stores/userdata';

    import DateManager from '@/static/date-manager';
    import Utils from '@/static/utils';

    import ForwardArrow from '@/assets/icons/ForwardArrow.vue';
    import BackwardArrow from '@/assets/icons/BackwardArrow.vue';
    import NoClassIcon from '@/assets/icons/NoClassIcon.vue';

    import ClassEvent from '@/components/planning/ClassEvent.vue';
    import EventLoader from '@/components/planning/EventLoader.vue';

    import Text from '@/ui/text/Text.vue';
    import HeaderSmall from '@/ui/text/HeaderSmall.vue';

    const { planning, loading, planningLoadingError } = storeToRefs(usePlanningStore());
    const { planningUrls, featuresEnabled, accentColor } = storeToRefs(useUserDataStore());

    const weekSelected = ref(0);
    const weekDaySelected = ref(selectDefaultWeekDay());

    const weekChangeAnim = ref(""); // Animation name

    const currentDayContentIndex = computed(() => {
        let currentDate = new Date();

        let currentDayNumber = DateManager.getDayNumber(currentDate);
        currentDate.setDate(currentDate.getDate() - currentDayNumber + weekDaySelected.value + weekSelected.value * 7);

        for(let i = 0; i < planning.value.length; i++) {
            if(planning.value[i][0].start.toDateString() == currentDate.toDateString()) {
                return { index: i, found: true }
            }
        }

        return { index: 0, found: false }
    });

    const selectedWeekDays = computed((): Array<WeekDay> => {
        let weekDaysNumber: Array<WeekDay> = [];
        let currentDate = new Date();

        let currentDay = DateManager.getDayNumber(currentDate);
        let firstWeekDay = currentDate.getDate() - currentDay;

        for(let i = 0; i < 7; i ++) {
            let newDate = new Date();
            newDate.setDate(weekSelected.value * 7 + firstWeekDay + i);

            weekDaysNumber.push({
                number: newDate.getDate(),
                nameShort: DateManager.getDaysName()[newDate.getDay()].slice(0, 3),
                monthName: DateManager.getMonthsName()[newDate.getMonth()],
                year: newDate.getFullYear().toString(),
            });
        }

        return weekDaysNumber;
    });

    function selectDefaultWeekDay() {
        let currentDate = new Date();

        if (currentDate.getHours() >= 19 && [0, 1, 2, 3].includes(DateManager.getDayNumber(currentDate))) return DateManager.getDayNumber(currentDate) + 1;
        else if(DateManager.getDayNumber(currentDate) == 6 || DateManager.getDayNumber(currentDate) == 5) {
            weekSelected.value += 1;
            return 0;
        }
        else  return DateManager.getDayNumber(currentDate);
    }

    let weekChangeTime = 0;
    let weekChangeDelay = 400;
    function nextWeek() {
        if(weekChangeTime + weekChangeDelay < Date.now()) {
            weekChangeAnim.value = "go-up";
            weekSelected.value += 1;

            weekChangeTime = Date.now();
        }
    }

    function previousWeek() {
        if(weekChangeTime + weekChangeDelay < Date.now()) {
            weekChangeAnim.value = "go-down";
            weekSelected.value = weekSelected.value > 0 ? weekSelected.value -= 1 : 0;

            weekChangeTime = Date.now();
        }
    }

    function unlockValentinesTheme() {
        featuresEnabled.value.specialColorThemes["easterEgg2"] = true;
        accentColor.value = "easteregg2";
        Utils.updateAccentColor();
    }

    interface WeekDay {
        number: number,
        nameShort: string,
        monthName: string,
        year: string,
    }
</script>

<style scoped>
    .weekday-selector {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-gap: 5px;
    }

    .weekday-selector div:nth-child(7n+1) { grid-area: 1 / 1; }
    .weekday-selector div:nth-child(7n+2) { grid-area: 1 / 2; }
    .weekday-selector div:nth-child(7n+3) { grid-area: 1 / 3; }
    .weekday-selector div:nth-child(7n+4) { grid-area: 1 / 4; }
    .weekday-selector div:nth-child(7n+5) { grid-area: 1 / 5; }
    .weekday-selector div:nth-child(7n+6) { grid-area: 1 / 6; }
    .weekday-selector div:nth-child(7n+7) { grid-area: 1 / 7; }

    /* Fade */
    /* .fadet-enter-active { transition: 0.3s; transition-delay: calc(0.3s + 2s * attr(data-animation-test)); }
    .fadet-leave-to, .fadet-enter-from { opacity: 0; }
    .fadet-leave-from, .fadet-enter-to { opacity: 1; }

    .fadet-leave-active{ transition: 0.3s; }
    .fadet-leave-active:nth-child(6n+1) { transition-delay: 0.3s; }
    .fadet-leave-active:nth-child(6n+2) { transition-delay: 0.2s; }
    .fadet-leave-active:nth-child(6n+3) { transition-delay: 0.1s; }
    .fadet-leave-active:nth-child(6n+4) { transition-delay: 0s; } */

    .go-up-leave-from, .go-up-enter-to, .go-down-leave-from, .go-down-enter-to {
        opacity: 1;
        margin-top: 0px;
    }

    .go-up-leave-to, .go-down-enter-from {
        opacity: 1;
        margin-top: -70px;
    }

    .go-up-enter-from, .go-down-leave-to {
        opacity: 1;
        margin-top: 70px;
    }
</style>@/static/date-manager