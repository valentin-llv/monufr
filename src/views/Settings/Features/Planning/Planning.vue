<template>
    <div class="base">
        <PageHeader title="Emploi du temps" />

        <SettingsLink class="mt-6 gap-6" to="/new-planning">
            <AddIcon class="h-16" />
            <Text class="color-900"> Ajouter un emploi du temps </Text>
        </SettingsLink>

        <SettingsLink class="mt-6 gap-6" to="/settings/planning-feature/delete-planning">
            <Delete class="h-16" />
            <Text class="color-900"> supprimer un emploi du temps </Text>
        </SettingsLink>

        <HeaderSmall class="color-900 mt-10 mb-6"> Evénements caché </HeaderSmall>

        <SettingsLink class="gap-6" to="/settings/planning-feature/restore-events">
            <Hide class="h-16" />
            <Text class="color-900"> Restaurer un événement caché </Text>
        </SettingsLink>

        <SettingsLink class="mt-6 gap-6" to="/settings/planning-feature/restore-type-event">
            <Hide class="h-16" />
            <Text class="color-900"> Restaurer un type d'événement </Text>
        </SettingsLink>
    </div>
</template>

<script setup lang="ts">
    import { useUserDataStore } from '@/stores/userdata';
    import { storeToRefs } from 'pinia';

    import PageHeader from "@/components/general/PageHeader.vue";
    import SettingsLink from "@/components/settings/SettingsLink.vue";

    import HeaderSmall from '@/ui/text/HeaderSmall.vue';
    import Text from '@/ui/text/Text.vue';

    import Hide from '@/assets/icons/Hide.vue';
    import Delete from '@/assets/icons/Delete.vue';
    import AddIcon from '@/assets/icons/AddIcon.vue';

    const {  } = storeToRefs(useUserDataStore());
</script>