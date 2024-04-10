<template>
    <div class="base">
        <PageHeader title="Signaler un problème" />

        <Text class="color-900 mt-6">
            Pour tous signalement de bugs veuillez envoyer un mail à l'adresse suivante.
        </Text>

        <div class="rounded-3xl bg-200 p-6 mt-6 flex flex-col">
            <Text class="text-blue-400 pointer-events-auto">
                <a target="_blank" href="mailto:valentin.le_lievre@etu.sorbonne-universite.fr?subject=MonUFR bug report">valentin.le_lievre@etu.sorbonne-universite.fr</a>
            </Text>
        </div>
    </div>
</template>

<script setup lang="ts">
    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';
</script>

<style scoped>

</style>