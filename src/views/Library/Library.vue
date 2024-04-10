<template>
    <div class="base">
        <div class="relative mb-6 pt-4">
            <HeaderSmall class="color-900 pr-24"> Bienvenue dans votre bibliothèque  📚 </HeaderSmall>
        
            <router-link to="/settings" class="absolute left-full -translate-x-full top-0">
                <Settings class="h-18 aspect-square" />
            </router-link>
        </div>

        <!-- View navigator start -->
        <div class="flex overflow-x-auto -ml-6 -mr-6 pl-6 pr-6 gap-4 mb-6 whitespace-nowrap">
            <div v-for="tabName, index in tabsNames" @click=changeTab(index)>
                <Text class="color-900 p-5 pl-8 pr-8 rounded-full bg-200 duration-300" :class="{ 'bg-accent': currentLibraryPage == index }">
                    {{ tabName }} 
                </Text>
            </div>
        </div>

        <!-- Library usage explanation
        <div class="rounded-3xl bg-accent-gradient p-6 mb-6">
            <HeaderSmall class="color-900 !text-4xl"> Usage de votre bibliothèque </HeaderSmall>

            <Text class="color-900 mt-4">
                Ceux-ci est votre page personnelle, elle vous permet de stocker et organiser vos informations.
                <br /><br />
                Elle s'enrichira de fonctionnalités dans le future pour plus vous ressembler.
                <br /><br />
                Pour le moment vous pouvez y ajouter des notes, des liens important et des mails. 
                <br />
                Pratique pour sauvegarder les mails de vos
                prof et les drives des cours.
            </Text>
        </div> -->

        <!-- Views start -->
        <div class="relative flex-1">
            <div v-for="tabName, index in tabsNames">
                <transition :name=tabTransitionName>
                    <div v-if="currentLibraryPage == index" class="absolute left-0 top-0 w-full h-full flex flex-col bg-100">
                        <component :is=tabs[index] class="flex-1" />
                    </div>
                </transition>
            </div>
        </div>

        <!-- Add item -->
        <router-link to="/library/add-item" class="fixed top-full left-full -translate-x-full -translate-y-full -mt-36 -ml-8 bg-accent rounded-[2rem] p-3">
            <AddIcon class="h-20" />
        </router-link>
    </div>
</template>

<script setup lang="ts">
    import { ref, shallowRef } from 'vue';
    import { storeToRefs } from 'pinia';

    import { useUserDataStore } from '@/stores/userdata';

    import All from './LibraryViews/All.vue';
    import Notes from './LibraryViews/Notes.vue';
    import Links from './LibraryViews/Links.vue';
    import Contacts from './LibraryViews/Contacts.vue';

    import Text from '@/ui/text/Text.vue';
    import HeaderSmall from '@/ui/text/HeaderSmall.vue';

    import Settings from '@/assets/icons/Settings.vue';
    import AddIcon from '@/assets/icons/AddIcon.vue';

    const { currentLibraryPage } = storeToRefs(useUserDataStore());

    const tabsNames = ref(["Tout", "Notes", "Liens", "Contacts"]);
    const tabs = shallowRef([All, Notes, Links, Contacts]);

    const tabTransitionName = ref('');

    let currentTabIndex = currentLibraryPage.value;
    function changeTab(newTabIndex: number) {
        if(newTabIndex > currentTabIndex) tabTransitionName.value = 'slide-in-full';
        else tabTransitionName.value = 'slide-out-full';

        currentLibraryPage.value = newTabIndex;
        currentTabIndex = newTabIndex;
    }
</script>

<style scoped>

</style>