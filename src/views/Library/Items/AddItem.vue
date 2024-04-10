<template>
    <div class="base">
        <PageHeader title="Crée un objet" />

        <div class="flex flex-col mt-6 bg-200 p-6 rounded-3xl">
            <Text class="color-900"> Type d'objet: </Text>

            <div class="flex flex-wrap gap-6 overflow-auto mt-6">
                <div :class="{ 'bg-accent': selectedType == objectType }" class="flex-1 text-center min-w-[40%] duration-300 p-6 bg-300 rounded-3xl" v-for="objectType, index in libObjectTypes" @click="selectedType = objectType">
                    <Text class="color-900"> {{ 
                        objectType == "note" ? "Texte" : objectType == "mail" ? "Email" : objectType == "link" ? "Lien" : ""
                    }} </Text>
                </div>
            </div>
        </div>

        <div class="flex-1 flex flex-col mt-6 bg-200 p-6 rounded-3xl">
            <Text class="color-900"> Création d'un {{ selectedType }} </Text>

            <div class="flex flex-col flex-1">
                <input v-model="objectTitle" class="outline-none rounded-3xl bg-300 mt-6 p-5 leading-3 text-4xl font-medium color-900" type="url" placeholder="Titre" />
                <textarea v-model="objectContent" class="h-full see-scroll rounded-3xl border-8 p-3 border-300 resize-none bg-300 color-900 text-size mt-6" placeholder="Contenu ..."></textarea>
            </div>

            <div v-if="!errorText">
                <Text v-if="selectedType == 'mail' && !Utils.isValidEmailAddress(objectContent)" class="text-red-400 mt-6 text-center"> Format d'email invalide ! </Text>
                <Text v-if="selectedType == 'link' && !Utils.isValidUrl(objectContent)" class="text-red-400 mt-6 text-center"> Format de lien invalide ! </Text>
            </div>

            <Text v-if="errorText" class="text-red-400 mt-6 text-center"> {{ errorText }} </Text>
        </div>

        <div class="flex mt-6 gap-4">
            <div @click="save" class="flex-1 bg-accent rounded-3xl flex justify-center p-6 items-center gap-4">
                <Save class="h-14" />
                <Text class="color-900"> Sauvegarder </Text>
            </div>

            <div @click="$router.go(-1)" class="flex-1 bg-red-400 rounded-3xl flex justify-center p-6 items-center gap-4">
                <Delete class="h-14" />
                <Text class="color-900"> Retour </Text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, type Ref } from "vue";
    import { storeToRefs } from 'pinia';
    import router from "@/router/router";

    import { useUserDataStore, libObjectTypes, type LibObjectTypes } from '@/stores/userdata';

    import Utils from "@/static/utils";

    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    import Save from '@/assets/icons/Save.vue';
    import Delete from '@/assets/icons/Delete.vue';

    const { libraryElements } = storeToRefs(useUserDataStore());

    const selectedType: Ref<LibObjectTypes> = ref("note"); // Text is default

    const objectTitle = ref("");
    const objectContent = ref("");

    const errorText = ref("");
    function save() {
        errorText.value = "";

        if(objectContent.value.length == 0) {
            errorText.value = "Le contenu ne peut être vide !";
            return false;
        }

        if(selectedType.value == 'mail' && !Utils.isValidEmailAddress(objectContent.value)) return false;
        if(selectedType.value == 'link' && !Utils.isValidUrl(objectContent.value)) return false;

        (libraryElements.value as any)[selectedType.value + "s"].push({
            type: selectedType.value,

            title: objectTitle.value,
            content: objectContent.value,

            date: new Date(),
        });

        router.go(-1);
    }
</script>