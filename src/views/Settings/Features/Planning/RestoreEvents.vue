<template>
    <div class="base">
        <PageHeader title="Restaurer des événements" />

        <Text class="color-900 mt-6">
            Voici la liste des événements que vous avez caché.
            <br />
            Vous pouvez les ré-ajouter	à votre emploi du temps en cliquant dessus.
        </Text>

        <Text v-if="!hiddenElements.length" class="color-900 mt-10">
            Vous n'avez aucun événements caché.
        </Text>

        <div v-for="event in hiddenElements">
            <HeaderSmall class="mt-10 color-900"> 
                {{ DateManager.getDaysName()[event.start.getDay()] }}&nbsp;{{ event.start.getDate() }}&nbsp;{{ DateManager.getMonthsName()[event.start.getMonth()] }} 
            </HeaderSmall>

            <ClassEvent @contextmenu.stop.capture.prevent @click.stop.capture="openLongPressModal(event)" :event=event />
        </div>

        <Teleport to="body">
            <PopupBase :show="showLongPressModal" @close="showLongPressModal = false">
                <div class="bg-200 rounded-3xl p-6 flex flex-col gap-6">
                    <div @click.prevent="restoreEvent()" class="rounded-2xl bg-300 p-6 flex justify-center">
                        <Text class="color-900"> Restaurer cet événements </Text>
                    </div>
                </div>

                <div @click="showLongPressModal = false" class="bg-red-400 rounded-full p-6 mt-6 flex justify-center">
                    <Text class="color-900"> Fermer </Text>
                </div>
            </PopupBase>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { ref, type Ref } from 'vue';

    import { usePlanningStore } from '@/stores/planning';
    import type { PlanningEvent } from '@/static/planning-parser';
    import { useUserDataStore } from '@/stores/userdata';

    import DateManager from '@/static/date-manager';

    import PopupBase from '@/components/popup/PopupBase.vue';

    import PageHeader from "@/components/general/PageHeader.vue";
    import ClassEvent from '@/components/planning/ClassEvent.vue';

    import HeaderSmall from '@/ui/text/HeaderSmall.vue';
    import Text from '@/ui/text/Text.vue';

    let planningStore = usePlanningStore();
    const { hiddenElements } = storeToRefs(planningStore);
    let userDataStore = useUserDataStore();

    const showLongPressModal = ref(false);
    const selectedEvent: Ref<PlanningEvent | undefined> = ref();

    function openLongPressModal(event: PlanningEvent) {
        window.navigator.vibrate(35);

        showLongPressModal.value = true;
        selectedEvent.value = event;
    }

    function restoreEvent() {
        if(selectedEvent.value) {
            let index = userDataStore.hideUniqueEvent.indexOf(selectedEvent.value.uid);
            userDataStore.hideUniqueEvent.splice(index, 1);

            showLongPressModal.value = false;
            planningStore.init();
        }
    }
</script>