<template>
    <div class="base">
        <PageHeader title="Ajouter un emploi du temps" />

        <Text class="mt-6 color-900">
            Pour ajouter un emploi du temps, vous devez utiliser son lien de téléchargement ou scanner le QrCode associé au lien. <br /> <br />

            <span class="color-accent"> Note: </span>
            vous pouvez ajouter plusieurs emplois du temps en même temps. 
            Pratique pour voir du premier coup d'oeil toute votre journée. <br /> <br />

            Pour avoir plusieurs emplois du temps sur la page d'accueil, répétez simplement l'opération plusieurs fois avec une url différente.
        </Text>

        <router-link to="/new-planning/how-to" class="bg-accent rounded-3xl flex p-6 mt-6 items-center">
            <Help class="h-16 aspect-square" />
            <Text class="color-900 ml-6"> Comment exporter mon emploi du temps </Text>
        </router-link>

        <router-link to="/new-planning/scan" class="bg-200 rounded-3xl flex p-6 mt-6 items-center app-hidden-tx3708">
            <QrCodeIcon class="h-16 aspect-square" />
            <Text class="color-900 ml-6"> Scanner le code </Text>
        </router-link>

        <router-link to="/new-planning/use-url" class="bg-200 rounded-3xl flex p-6 mt-6 items-center">
            <Link class="h-16 aspect-square" />
            <Text class="color-900 ml-6"> Renseigner une url </Text>
        </router-link>
    </div>
</template>

<script setup lang="ts">
    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    import QrCodeIcon from '@/assets/icons/QrCodeIcon.vue';
    import Help from '@/assets/icons/Help.vue';
    import Link from '@/assets/icons/Link.vue';
</script>

<style scoped>

</style>