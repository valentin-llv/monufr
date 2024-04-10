<template>
    <div class="base">
        <PageHeader title="Masquer un évènement" />

        <Text class="color-900 mt-6">
            Vous pouvez choisir de cacher certains événements qui ne vous intéresse pas. 
            <br /><br />
            Vous avez pour cela deux options:
        </Text>

        <div class="rounded-3xl bg-200 mt-6 p-6">
            <Text class="color-900">
                Vous pouvez choisir de cacher uniquement cet événement. Celui-ci disparaitra de votre 
                liste d'événements. 
                <br /><br />
                Aucun changement sera apporté aux autre événements.
            </Text>

            <div @click="hideOne" class="bg-accent flex-1 flex p-6 rounded-3xl text-center mt-6 items-center">
                <Text class="color-900"> Cacher uniquement cet événement </Text>
            </div>
        </div>

        <div @click="hideAll" class="rounded-xl bg-200 mt-6 p-6">
            <Text class="color-900">
                Autrement vous pouvez cacher tous les événements de même type. Ainsi tout les événements 
                portant le même nom disparaitront de votre planning.
            </Text>

            <div class="bg-accent flex-1 flex p-6 rounded-3xl text-center mt-6 items-center">
                <Text class="color-900"> Cacher tous les événements de ce type </Text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import router from '@/router/router';

    import { useUserDataStore } from '@/stores/userdata';
    import { usePlanningStore } from '@/stores/planning';

    import type { PlanningEvent } from '@/static/planning-parser';

    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    function hideOne() {
        let planningStore = usePlanningStore();

        useUserDataStore().hideUniqueEvent.push((planningStore.selectedEvent as PlanningEvent).uid);
        planningStore.init();

        router.go(-2);
    }

    function hideAll() {
        let planningStore = usePlanningStore();

        useUserDataStore().hideAllEvents.push((planningStore.selectedEvent as PlanningEvent).summary);
        planningStore.init();

        router.go(-2);
    }
</script>

<style scoped>

</style>@/static/planning-downloader