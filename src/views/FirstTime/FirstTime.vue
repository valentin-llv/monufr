<template>
    <div class="base">
        <div :class="{ 'top-1/2 -translate-y-1/2 -mt-20 gap-12': !started, 'mt-16 gap-6': started }" class="duration-300 absolute top-0 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center w-full pl-14 pr-14">
            <img :class="{ 'w-64 rounded-[3rem]': !started, 'w-40 rounded-[1.5rem]': started }" class="duration-300 aspect-square bg-900" src="/favicon/favicon.svg" />
            <HeaderSmall :class="{ 'scale-90': started }" class="duration-300 color-900 text-center">
                La meilleure application pour consulter son emploi du temps&nbsp;!
            </HeaderSmall>
        </div>

        <div class="relative flex-1 w-full overflow-hidden mt-80">
            <div :class="{ '-left-full -translate-x-full': step >= 4, 'left-0': step < 4 }" class="absolute top-1/2 -translate-y-1/2 duration-300 h-full flex flex-col justify-center items-center">
                <transition name="fadetest">
                    <div v-if="started" class="pl-10 pr-10 w-full duration-300 mt-10 flex items-center flex-row">
                        <div class="bg-900 h-5 w-5 rounded-full mr-6"></div>
                        <Text class="color-900 !text-4xl flex-1"> Votre emploi du temps sur votre telephone ! </Text>
                    </div>
                </transition>

                <transition name="fadetest">
                    <div v-if="step >= 2" class="pl-10 pr-10 mt-10 w-full duration-300 overflow-hidden h-20 flex items-center flex-row pt-4">
                        <div class="bg-900 h-5 w-5 rounded-full mr-6"></div>
                        <Text class="color-900 !text-4xl flex-1"> Même sans internet </Text>
                    </div>
                </transition>

                <transition name="fadetest">
                    <div v-if="step >= 3" class="pl-10 pr-10 mt-10 w-full duration-300 overflow-hidden h-20 flex flex-row items-center">
                        <div class="bg-900 h-5 w-5 rounded-full mr-6"></div>
                        <Text class="color-900 !text-4xl flex-1"> Et mis à jour automatiquement ! </Text>
                    </div>
                </transition>
            </div>

            <div :class="{ 'left-full': step <= 3, 'left-0': step == 4 }" class="w-full flex flex-col duration-300 absolute top-1/2 -translate-y-1/2 max-h-[65%] min-h-[65%]">
                <Text class="color-900 duration-300">
                    Veuillez selectionner votre ville.
                </Text>

                <div class="bg-200 p-6 rounded-3xl flex-1 flex flex-col mt-6 overflow-hidden">
                    <div class="pr-6 flex flex-col gap-4 overflow-auto see-scroll">
                        <div :class="{ 'pl-10 bg-accent': selectedCity == index }" class="duration-300 p-6 bg-300 rounded-2xl flex flex-row items-center gap-3 max-h-[48px] min-h-[48px]" v-for="cityName, index in cities" @click="selectedCity = index">
                            <img v-if="cityName.includes('Polytech')" class="-ml-3 bg-300 rounded-3xl w-14 p-1" src="@/assets/images/polytech.webp" />
                            <LogoGobelins v-if="cityName.includes('Gobelins')" class="-ml-3 bg-300 rounded-3xl p-1 w-[3.5em] pl-4 pr-4" />

                            <Text class="color-900 duration-300 "> {{ cityName }} </Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex duration-300" :class="{ 'gap-6': !started, 'gap-0': started }">
            <div @click="start" :class="{ 'pointer-events-none opacity-60': selectedCity == -1 && step == 4 }" class="duration-300 flex flex-1 p-7 bg-accent rounded-3xl border-2 border-accent">
                <Text class="text-center color-900 m-auto"> {{ buttonContent }} </Text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import router from "@/router/router";
    import { storeToRefs } from "pinia";

    import { cities, useUserDataStore } from "@/stores/userdata";

    import Text from '@/ui/text/Text.vue';
    import HeaderSmall from '@/ui/text/HeaderSmall.vue';

    import LogoGobelins from '@/assets/images/gobelins.vue';
    
    const { knownUser, city } = storeToRefs(useUserDataStore());
    const selectedCity = ref(-1);

    const started = ref(false);
    const buttonContent = ref("Commencer");

    const step = ref(1);

    function start() {
        if(started.value == false) {
            started.value = true;
            buttonContent.value = "Suivant";
        } else if (step.value < 4) step.value ++;
        else if (step.value == 4) {
            step.value ++;
            buttonContent.value = "Terminer";
        } else {
            knownUser.value = true;
            city.value = cities[selectedCity.value];

            router.replace("/");
        }
    }
</script>

<style scoped>
/* Fade */
.fadetest-enter-active, .fadetest-leave-active { transition: 0.3s opacity 0.2s, 0.3s margin-top 0.2s, 0.3s height 0.2s; }
.fadetest-enter-from { opacity: 0; margin-top: 0px; height: 0px; }
.fadetest-enter-to { opacity: 1; margin-top: 2.5rem; height: 5rem;  }
</style>