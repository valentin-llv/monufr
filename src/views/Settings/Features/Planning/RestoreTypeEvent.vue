<template>
    <div class="base">
        <PageHeader title="Restaurer des événements" />

        <Text class="color-900 mt-6">
            Voici la liste des types d'événements que vous avez caché.
            <br />
            Vous pouvez les ré-ajouter à votre emploi du temps en cliquant dessus.
        </Text>

        <Text v-if="!hideAllEvents.length" class="color-900 mt-10">
            Vous n'avez aucun événements caché.
        </Text>

        <div class="mt-10" v-for="type in hideAllEvents">
            <div @click.prevent="openLongPressModal(type)" class="rounded-2xl bg-200 p-6">
                <Text class="color-900"> {{ type }} </Text>
            </div>
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
    import { useUserDataStore } from '@/stores/userdata';

    import PopupBase from '@/components/popup/PopupBase.vue';

    import PageHeader from "@/components/general/PageHeader.vue";
    import Text from '@/ui/text/Text.vue';

    let planningStore = usePlanningStore();
    let userDataStore = useUserDataStore();
    const { hideAllEvents } = storeToRefs(userDataStore);

    const showLongPressModal = ref(false);
    const selectedType: Ref<string | undefined> = ref();

    function openLongPressModal(type: string) {
        window.navigator.vibrate(35);

        showLongPressModal.value = true;
        selectedType.value = type;
    }

    function restoreEvent() {
        if(selectedType.value) {
            let index = userDataStore.hideAllEvents.indexOf(selectedType.value);
            userDataStore.hideAllEvents.splice(index, 1);

            showLongPressModal.value = false;
            planningStore.init();
        }
    }
</script>