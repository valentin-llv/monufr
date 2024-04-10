<template>
    <div class="base">
        <PageHeader title="Utiliser une url" />

        <!-- Explanation text -->
        <Text class="mt-6 color-900">
            Utilisez le champ ci-dessous pour renseigner l'url de telechargement de votre emploi du temps.
        </Text>

        <!-- Url form -->
        <input v-model="url" @keyup.enter=addPlanning class="mt-6 outline-none rounded-3xl bg-200 p-5 leading-3 text-4xl font-medium color-900" type="url" placeholder="Url de l'emploi du temps ..." spellcheck="false" autocapitalize="off" />

        <!-- Send button -->
        <div class="mt-6 p-6 bg-accent rounded-3xl flex gap-6 items-center" @click=addPlanning>
            <AddIcon v-if="!displayLoader" class="h-16 aspect-square" />
            <Text v-if="!displayLoader" class="color-900 flex-1"> Ajouter un emploi du temps </Text>
            <SpinningRing v-if="displayLoader" />
        </div>

        <router-link to="/new-planning/how-to" class="rounded-3xl bg-200 flex p-6 mt-6 items-center">
            <Help class="h-16 aspect-square" />
            <Text class="color-900 ml-160"> Trouver mon url </Text>
        </router-link>

        <!-- Error message -->
        <Text class="text-red-500 mt-6 text-center" v-if="!displayLoader"> {{ errorMessage }} </Text>
    </div>
</template>  

<script setup lang="ts">
    import { ref } from "vue";
    import router from "@/router/router";

    import Planning from "@/static/planning-downloader";

    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    import SpinningRing from '@/components/animations/SpinningRing.vue';

    import Help from '@/assets/icons/Help.vue';
    import AddIcon from "@/assets/icons/AddIcon.vue";

    const displayLoader = ref(false);
    const errorMessage = ref("");
    const url = ref("");

    async function addPlanning(event: Event) {
        //@ts-ignore
        event.target.blur();

        if(displayLoader.value == true) return false;
        displayLoader.value = true;

        let result = await Planning.addPlanning(url.value);
        if("msg" in result && result.msg) {
            errorMessage.value = result.msg;
            displayLoader.value = false;
            return false;
        }

        router.go(-2);
        router.push("/planning");
    }
</script>

<style scoped>

</style>@/static/planning-downloader