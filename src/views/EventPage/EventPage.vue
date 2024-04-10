<template>
    <div class="base">
        <PageHeader :title=selectedEvent.summary />

        <ClassEvent :event=selectedEvent :edit=true />

        <hr class="ml-6 mr-6 mt-6 mb-6" />

        <div class="bg-200 p-6 rounded-3xl">
            <Text class="color-900"> Marquer ce cours comme prêt ! </Text>

            <div @click="toogleClassReady" class="relative rounded-3xl bg-300 p-6 mt-6 flex flex-row items-center overflow-hidden">
                <Text v-html=classReadyButtonText :class="{ '': classPrepared.includes(selectedEvent.uid), 'flex-1': !classPrepared.includes(selectedEvent.uid) }" class="text-center duration-300 color-900"></Text>

                <div :class="{ 'ml-40': !classPrepared.includes(selectedEvent.uid) }" class="absolute left-full -translate-x-full duration-300 pr-20 p-4 bg-accent">
                    <CheckMark class="h-14" />
                </div>
            </div>
        </div>

        <SettingsLink class="mt-6 gap-6" v-if="!eventsNotes[selectedEvent.uid]" to="/event/edit-note">
            <Note class="h-16" />
            <Text class="color-900"> Ajouter une note de rappel </Text>
        </SettingsLink>
        
        <hr class="ml-6 mr-6 mt-6 mb-6" />

        <SettingsLink class="gap-6" to="/event/hide-event">
            <Hide class="h-16" />
            <Text class="color-900"> Masquer le.s évènement.s </Text>
        </SettingsLink>

        <!-- Color selection section start -->
        <div class="flex flex-col items-center p-6 bg-200 mt-6 rounded-3xl duration-300">
            <Text class="w-full color-900 duration-300"> Couleur d'accentuation </Text>

            <div class="color-grid mt-6">
                <div v-for="index in accents" @click="toggleEventAccentColor(index)" :style="{ backgroundColor: index }" :class="{ 'border-900': ( eventsColors[selectedEvent.summary] && eventsColors[selectedEvent.summary].color1 == index) }" class="h-12 w-12 duration-300 rounded-full border-3 border-transparent"></div>
            </div>

            <div @click="resetEventColor" class="rounded-3xl bg-300 p-6 mt-8 flex items-center">
                <Text class="color-900"> Restaurer par la valeur par défaut </Text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { storeToRefs } from 'pinia';

    import { usePlanningStore } from '@/stores/planning';
    import { useUserDataStore } from '@/stores/userdata';
    import type { PlanningEvent } from '@/static/planning-parser';

    import GlobalVars from '@/static/globalVars';

    import PageHeader from "@/components/general/PageHeader.vue";

    import ClassEvent from '@/components/planning/ClassEvent.vue';

    import SettingsLink from '@/components/settings/SettingsLink.vue';

    import Text from '@/ui/text/Text.vue';

    import CheckMark from '@/assets/icons/Checkmark.vue';
    import Hide from '@/assets/icons/Hide.vue';
    import Note from '@/assets/icons/Note.vue';

    const planningStore = usePlanningStore();

    const { classPrepared, eventsNotes, eventsColors } = storeToRefs(useUserDataStore());

    const selectedEvent = ref(planningStore.selectedEvent as PlanningEvent);

    const accents = ref(GlobalVars.accents);

    const classReadyButtonText = ref(classPrepared.value.includes(selectedEvent.value.uid) ? "Fait" : "A&nbsp;faire");
    function toogleClassReady() {
        if(classPrepared.value.includes(selectedEvent.value.uid)) {
            classPrepared.value.splice(classPrepared.value.indexOf(selectedEvent.value.uid), 1);
            setTimeout(() => {
                classReadyButtonText.value = "A&nbsp;faire";
            }, 100);
        }
        else {
            classPrepared.value.push(selectedEvent.value.uid);
            setTimeout(() => {
                classReadyButtonText.value = "Fait";
            }, 100);
        }
    }

    function toggleEventAccentColor(colorIndex: string) {
        eventsColors.value[selectedEvent.value.summary] = {
            color1: colorIndex,
        }
    }

    function resetEventColor() {
        delete eventsColors.value[selectedEvent.value.summary];
    }
</script>@/static/planning-downloader