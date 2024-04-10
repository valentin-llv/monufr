<template>
    <div class="base">
        <PageHeader title="Modification d'un objet" />

        <div class="flex-1 flex flex-col mt-6 bg-200 p-6 rounded-3xl">
            <div class="flex flex-col flex-1">
                <input v-model="selectedElement.title" class="outline-none rounded-3xl bg-300 p-5 leading-3 text-4xl font-medium color-900" type="url" placeholder="Titre" />
                <textarea v-model="selectedElement.content" class="h-full see-scroll rounded-3xl border-8 p-3 border-300 resize-none bg-300 color-900 text-size mt-6" placeholder="Contenu ..."></textarea>
            </div>

            <div v-if="!errorText">
                <Text v-if="selectedElement.type == 'Email' && !Utils.isValidEmailAddress(selectedElement.content)" class="text-red-400 mt-6 text-center"> Format d'email invalide ! </Text>
                <Text v-if="selectedElement.type == 'Lien' && !Utils.isValidUrl(selectedElement.content)" class="text-red-400 mt-6 text-center"> Format de lien invalide ! </Text>
            </div>

            <Text v-if="errorText" class="text-red-400 mt-6 text-center"> {{ errorText }} </Text>
        </div>

        <div class="flex mt-6 gap-4">
            <div @click="save" class="flex-1 bg-accent rounded-3xl flex justify-center p-6 items-center gap-4">
                <Save class="h-14" />
                <Text class="color-900"> Sauvegarder </Text>
            </div>

            <div @click=deleteElement class="flex-1 bg-red-400 rounded-3xl flex justify-center p-6 items-center gap-4">
                <Delete class="h-14" />
                <Text class="color-900"> Supprimer </Text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, type Ref } from "vue";
    import { storeToRefs } from 'pinia';
    import router from "@/router/router";

    import { useUserDataStore, type LibraryElement } from '@/stores/userdata';

    import Utils from "@/static/utils";

    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    import Save from '@/assets/icons/Save.vue';
    import Delete from '@/assets/icons/Delete.vue';

    const userDataStore = useUserDataStore();
    const { libraryElements } = storeToRefs(userDataStore);

    const selectedElement: Ref<LibraryElement> = ref(userDataStore.selectedElement as LibraryElement);

    const errorText = ref("");
    function save() {
        errorText.value = "";

        if(selectedElement.value.content.length == 0) {
            errorText.value = "Le contenu ne peut être vide !";
            return false;
        }

        if(selectedElement.value.type == 'mail' && !Utils.isValidEmailAddress(selectedElement.value.content)) return false;
        if(selectedElement.value.type == 'link' && !Utils.isValidUrl(selectedElement.value.content)) return false;

        for(let i = 0; i < (libraryElements.value as any)[selectedElement.value.type + "s"].length; i++) {
            if((libraryElements.value as any)[selectedElement.value.type + "s"][i].date.getTime() == selectedElement.value.date.getTime()) {
                (libraryElements.value as any)[selectedElement.value.type + "s"][i].content = selectedElement.value.content;
                (libraryElements.value as any)[selectedElement.value.type + "s"][i].title = selectedElement.value.title;
            }
        }

        router.go(-1);
    }

    function deleteElement() {
        for(let i = 0; i < (libraryElements.value as any)[selectedElement.value.type + "s"].length; i++) {
            if(typeof (libraryElements.value as any)[selectedElement.value.type + "s"][i].date == "string") {
                (libraryElements.value as any)[selectedElement.value.type + "s"][i].date = new Date((libraryElements.value as any)[selectedElement.value.type + "s"][i].date);
            }

            if((libraryElements.value as any)[selectedElement.value.type + "s"][i].date.getTime() == selectedElement.value.date.getTime()) {
                (libraryElements.value as any)[selectedElement.value.type + "s"].splice(i, 1);
            }
        }

        router.go(-1);
    }
</script>