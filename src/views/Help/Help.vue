<template>
    <div class="base">
        <PageHeader title="Aide" />

        <SettingsLink class="mt-6 gap-6" to="/help/install-on-ios">
            <DownloadIcon class="h-16" />
            <Text class="color-900"> Installation avec un iPhone </Text>
        </SettingsLink>
    </div>
</template>

<script setup lang="ts">
    import PageHeader from "@/components/general/PageHeader.vue";
    import SettingsLink from "@/components/settings/SettingsLink.vue";

    import Text from '@/ui/text/Text.vue';

    import DownloadIcon from '@/assets/icons/DownloadIcon.vue';
</script>