<template>
    <div class="base">
        <PageHeader title="Ajouter une note" />

        <div class="mt-6" v-if="!eventsNotes[selectedEvent.uid]">
            <Text class="color-900">
                Vous pouvez ajouter un rappel à un cours. Celle-ci apparaitra juste en dessous du cours dans la liste des cours.
                <br /><br />
                Pratique pour ne rien oublier avant un cours !
            </Text>

            <div @click="addNote" class="bg-accent rounded-3xl flex p-6 mt-6 items-center">
                <Edit class="h-16" />
                <Text class="color-900 ml-6"> Crée une note </Text>
            </div>
        </div>

        <div v-if="eventsNotes[selectedEvent.uid]" class="flex flex-col flex-1 mt-6">
            <textarea v-model="eventsNotes[selectedEvent.uid].content" class="h-full see-scroll rounded-3xl border-8 p-3 border-300 resize-none bg-300 color-900 text-size" placeholder="Contenu ..."></textarea>
            
            <div class="flex mt-6 gap-6">
                <div @click="$router.go(-1)" class="flex-1 bg-accent rounded-3xl flex justify-center p-6 items-center gap-6">
                    <Save class="h-14 aspect-square" />
                    <Text class="color-900"> Sauvegarder </Text>
                </div>

                <div @click="deleteNote" class="flex-1 bg-red-400 rounded-3xl flex justify-center p-6 items-center gap-6">
                    <Delete class="h-14 aspect-square" />
                    <Text class="color-900"> Supprimer </Text>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { type Ref, ref, onUnmounted } from 'vue';
    import { storeToRefs } from 'pinia';

    import { useUserDataStore } from '@/stores/userdata';
    import { usePlanningStore } from '@/stores/planning';

    import type { PlanningEvent } from '@/static/planning-parser';

    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    import Edit from '@/assets/icons/Edit.vue';
    import Save from '@/assets/icons/Save.vue';
    import Delete from '@/assets/icons/Delete.vue';

    const { eventsNotes } = storeToRefs(useUserDataStore());

    let planningStore = usePlanningStore();

    const selectedEvent: Ref<PlanningEvent> = ref(planningStore.selectedEvent as PlanningEvent);

    function addNote() {
        eventsNotes.value[selectedEvent.value.uid] = {
            date: Date.now(),
            content: "",
        }
    }

    function deleteNote() {
        delete eventsNotes.value[selectedEvent.value.uid];
    }

    onUnmounted(() => {
        if(eventsNotes.value[selectedEvent.value.uid] && eventsNotes.value[selectedEvent.value.uid].content == "") {
            delete eventsNotes.value[selectedEvent.value.uid];
        }
    });
</script>

<style scoped>

</style>@/static/planning-downloader