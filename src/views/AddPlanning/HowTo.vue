<template>
    <div class="base">
        <PageHeader title="Exporter mon empoi du temps" />

        <Text v-if="['Tours, Université de Tours', 'Tours, Polytech', 'Paris, Polytech Sorbonne', 'Paris, Sorbonne UPMC'].includes(city)" class="mt-6 color-900">
            La fonction d'export est disponible en bas à gauche de ADE, juste à coté du boutton pour imprimer.
            <br /><br />
            Pensez avant tout à bien sélectionner votre emploi du temps dans la liste des ressources.
            <br /><br />
            <span class="color-accent"> Note:</span> verifiez bien la periode d'export de votre emploi du temps. Par defaut celle-ci est
            d'une ou deux semaines. Pour ne plus être embêté vous pouvez sélectionner l'export jusqu'à la fin de l'année.
            <br /><br />
            Pour terminer selectionnez le format "ICalendar (Outlook/Mozilla/Google Calendar/ICal)" pour une meilleur compatibilité 
            avec l'application. Et cliquez sur "Generer URL".
        </Text>

        <Text v-if="['Montpellier, Polytech', 'Montpellier, Université de Montpelier'].includes(city)" class="mt-6 color-900">
            Lorsque vous venez de votre ENT, utilisez l'application "Planning 23 - 24" et avant de cliquez sur "Visualiser le planning", 
            cliquez sur l'onglet "iCal".
            <br /><br />
            Assurez vous d'être bien incrit dans tout vos cours car ceux-ci ne seront pas exportés à posteriori et vous 
            devrez effectuer la procedure d'export à nouveau.
            <br /><br />
            Pour terminer vous n'avez plus qu'à renseigner l'url dans l'application.
        </Text>

        <Text v-if="['Paris, Gobelins'].includes(city)" class="mt-6 color-900">
            Pour exporter vous emploi du temps, rendez-vous sur votre ENT, ensuite sélectionnez votre compte en haut à droite, puis
            "Paramètres utilisateur".
            <br /><br />
            Ensuite dans la section "Détails du profil" puis "Profil" puis "Export du planning" cliquez sur le lien "Format ICalendar".
            <br /><br />
            Pour terminer vous n'avez plus qu'à renseigner l'url dans l'application.
        </Text>

        <Text v-if="city.includes('Autre')" class="mt-6 color-900">
            Pour ajouter votre emploi du temps dans MonUFR vous devez, depuis votre service actuel d'emploi du temps, pouvoir exporter celui-ci au 
            format ".ics".
            <br /><br />
            La plupart du temps vous pourrez trouver la fonction d'export dans les paramètres de votre compte.
            <br /><br />
            <span class="color-accent"> Note:</span> vous avez uniquement besoin de l'url ou du QrCode de l'url. 
            Pas besoin de télécharger le fichier "".ics".
        </Text>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from "pinia";

    import { useUserDataStore } from "@/stores/userdata";

    import PageHeader from "@/components/general/PageHeader.vue";;

    import Text from '@/ui/text/Text.vue';

    const { city  } = storeToRefs(useUserDataStore());
</script>

<style scoped>

</style>