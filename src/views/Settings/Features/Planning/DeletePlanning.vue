<template>
    <div class="base">
        <PageHeader title="Supprimer un emploi du temps" />

        <Text class="color-900 mt-6">
            Voici la liste de vous emploi du temps
            <br />
            Vous pouvez les supprimer en cliquant dessus.
        </Text>

        <Text v-if="!planningUrls.length" class="color-900 mt-10">
            Vous n'avez aucun emploi du temps.
        </Text>

        <div v-for="planningInfos, index in planningUrls" @click="openLongPressModal(index)" class="rounded-3xl bg-200 mt-6 p-6 flex flex-col">
            <div class="flex flex-col flex-1">
                <Text class="color-900">
                    Ajouté le {{ DateManager.getDateText(new Date(planningInfos.date)) }} à {{ DateManager.getHourText(new Date(planningInfos.date)) }}
                </Text>

                <Text class="mt-4 color-900 opacity-40 scale-95 -ml-3">
                    {{ planningInfos.url.slice(0, 29) }}
                </Text>
            </div>
        </div>

        <Teleport to="body">
            <PopupBase :show="showLongPressModal" @close="showLongPressModal = false">
                <div class="bg-200 rounded-3xl p-6 flex flex-col gap-6">
                    <div @click.prevent="deletePlanning()" class="rounded-2xl bg-300 p-6 flex justify-center">
                        <Text class="color-900"> Supprimer cet emploi du temps </Text>
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

    import { useUserDataStore } from '@/stores/userdata';
    import { usePlanningStore } from '@/stores/planning';

    import DateManager from '@/static/date-manager';

    import PopupBase from '@/components/popup/PopupBase.vue';

    import PageHeader from "@/components/general/PageHeader.vue";
    import Text from '@/ui/text/Text.vue';

    let planningStore = usePlanningStore();
    let userDataStore = useUserDataStore();
    const { planningUrls } = storeToRefs(userDataStore);

    const showLongPressModal = ref(false);
    const selectedPlanning: Ref<number> = ref(-1);

    function openLongPressModal(index: number) {
        window.navigator.vibrate(35);

        showLongPressModal.value = true;
        selectedPlanning.value = index;
    }

    function deletePlanning() {
        if(selectedPlanning.value != -1) {
            planningUrls.value.splice(selectedPlanning.value, 1);

            showLongPressModal.value = false;
            planningStore.init();
        }
    }
</script>