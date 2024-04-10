<template>
    <div>
        <a href="https://moodle.umontpellier.fr/my/courses.php" target="_blank" class="bg-200 flex-1 flex flex-row p-6 rounded-3xl items-center">
            <img src="@/assets/images/moodle.webp" class="h-16 aspect-square rounded-2xl" />
            <Text class="color-900 ml-6"> Accès à Moodle </Text>
        </a>

        <a href="https://mail.umontpellier.fr/mail#1" target="_blank" class="bg-200 flex-1 flex flex-row p-6 rounded-3xl items-center mt-4">
            <img src="@/assets/images/zimbra.webp" class="h-16 aspect-square rounded-2xl" />
            <Text class="color-900 ml-6"> Accès à la boite mail </Text>
        </a>

        <a href="https://app.umontpellier.fr/mdw/#!etatCivilView" target="_blank" class="bg-200 flex-1 flex flex-row p-6 rounded-3xl items-center mt-4">
            <BriefCase class="h-12 mt-2 mb-2 mr-2" />
            <Text class="color-900 ml-6"> Accès à Mon dossier web </Text>
        </a>
    </div>
</template>

<script setup lang="ts">
    import Text from '@/ui/text/Text.vue';

    import BriefCase from '@/assets/icons/BriefCase.vue';
</script>

<style scoped>

</style>