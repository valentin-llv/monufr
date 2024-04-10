<template>
    <div class="base">
        <PageHeader title="Installation avec un iPhone" />

        <Text class="color-900 mt-6">
            L'installation sur iOS est sensiblement différente de l'insllation sur Android.
            <br /><br />
            Le résultat est toutefois le même, vous pourrez accéder à l'application depuis votre écran d'accueil.
            <br /><br />
            MonUFR est une PWA (un site internet installable), pas besoin donc de passer par l'AppStore. C'est simple rapide et sécurisé.
            <br /><br /><br />
            <b>Etapes d'installations:</b><br /><br />
            Cliquez sur l'icone de partage:<br /><br />
            <img class="rounded-3xl" src="@/assets/images/iphone-install/screen-1.png" />
            <br /><br />
            Puis "Ajouter à l'écran d'accueil"<br /><br />
            <img class="rounded-3xl" src="@/assets/images/iphone-install/screen-2.png" />
            <br /><br />
            Puis "Ajouter"<br /><br />
            <img class="rounded-3xl" src="@/assets/images/iphone-install/screen-3.png" />
            <br /><br />
            Après quelques secondes, l'application sera disponible sur votre écran d'accueil comme n'importe qu'elle application.
        </Text>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from "pinia";
    import { onMounted } from "vue";

    import { useUserDataStore } from "@/stores/userdata";

    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    const { installOnIosSeen } = storeToRefs(useUserDataStore());

    onMounted(() => {
        installOnIosSeen.value = true;
    });
</script>

<style scoped>

</style>