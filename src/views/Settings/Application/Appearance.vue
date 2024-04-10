<template>
    <div class="base duration-300">
        <PageHeader title="Apparance de l'application" />

        <!-- Dark mode toogle start -->
        <label @change="toggleThemeColor" class="flex flex-row items-center p-6 bg-200 duration-300 mt-6 rounded-3xl gap-6">
            <Text class="color-900 flex-1 m-auto duration-300"> Mode sombre </Text>

            <input v-model=checked type="checkbox" class="peer hidden" />
            <span :class="{ 'bg-accent': checked }" class="checkbox w-24 h-14 flex p-3 bg-300 rounded-full duration-300 after:w-8 after:h-8 after:rounded-full after:duration-300 peer-checked:after:translate-x-10"></span>
        </label>

        <!-- Color selection section start -->
        <div class="flex flex-col items-center p-6 bg-200 mt-6 rounded-3xl duration-300">
            <Text class="w-full color-900 duration-300"> Couleur d'accentuation </Text>

            <div class="color-grid mt-6">
                <div v-for="index in accents" @click="toggleAccentColor(index)" :style="{ backgroundColor: index }" :class="{ 'border-900': accentColor == index }" class="h-12 w-12 duration-300 rounded-full border-3 border-transparent"></div>
            </div>
        </div>

        <!-- Special colors selection section start -->
        <div class="flex flex-col p-6 bg-200 mt-6 rounded-3xl duration-300">
            <Text class="w-full color-900 duration-300"> Thèmes spéciaux </Text>

            <div class="flex justify-center mt-6 gap-4">
                <div @click="setEasterEggTheme(1)" :class="{ 'border-900': accentColor == 'easteregg1' }" class="border-3 border-transparent bg-300 duration-300 rounded-2xl p-6 flex flex-col gap-6 justify-center items-center">
                    <div class="h-12 w-12 rounded-full special-theme1 duration-300"></div>
                    <Lock v-if="!featuresEnabled.specialColorThemes.easterEgg1" class="h-14 aspect-square" />
                    <Unlock v-if="featuresEnabled.specialColorThemes.easterEgg1" class="h-14 aspect-square" />
                </div>

                <div @click="setEasterEggTheme(2)" :class="{ 'border-900': accentColor == 'easteregg2' }" class="border-3 border-transparent bg-300 duration-300 rounded-2xl p-6 flex flex-col gap-6 justify-center items-center">
                    <div class="h-12 w-12 rounded-full special-theme2 duration-300"></div>
                    <Lock v-if="!featuresEnabled.specialColorThemes.easterEgg2" class="h-14 aspect-square" />
                    <Unlock v-if="featuresEnabled.specialColorThemes.easterEgg2" class="h-14 aspect-square" />
                </div>

                <div @click="setEasterEggTheme(3)" :class="{ 'border-900': accentColor == 'easteregg3' }" class="border-3 border-transparent bg-300 duration-300 rounded-2xl p-6 flex flex-col gap-6 justify-center items-center">
                    <div class="h-12 w-12 rounded-full special-theme3 duration-300"></div>
                    <Lock v-if="!featuresEnabled.specialColorThemes.easterEgg3" class="h-14 aspect-square" />
                    <Unlock v-if="featuresEnabled.specialColorThemes.easterEgg3" class="h-14 aspect-square" />
                </div>
            </div>

            <SettingsLink class="mt-6" :light="true" to="/settings/unlock-new-theme">
                <Text class="color-900"> Débloquer un nouveau thème </Text>
            </SettingsLink>
        </div>

        <div :class="{ 'mt-32': !showLockMessage }" class="fixed top-full duration-200 -translate-y-full left-1/2 -translate-x-1/2 rounded-3xl bg-300 p-6 -mt-8">
            <Text class="text-red-500 text-center">
                Vous&nbsp;n'avez&nbsp;pas&nbsp;debloqué cette&nbsp;récompense !
            </Text>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { ref } from 'vue';
    import { useUserDataStore } from '@/stores/userdata';
    import { storeToRefs } from 'pinia';

    import Utils from '@/static/utils';
    import GlobalVars from '@/static/globalVars';

    import PageHeader from "@/components/general/PageHeader.vue";
    import SettingsLink from '@/components/settings/SettingsLink.vue';

    import Text from '@/ui/text/Text.vue';

    import Lock from '@/assets/icons/Lock.vue';
    import Unlock from '@/assets/icons/Unlock.vue';

    const { themeColor, accentColor, featuresEnabled } = storeToRefs(useUserDataStore());
    const accents = ref(GlobalVars.accents);

    const checked = ref(themeColor.value == 'dark');

    function toggleThemeColor() {
        themeColor.value = themeColor.value == "dark" ? "light" : "dark";
        Utils.updateThemeColor();
    }

    function toggleAccentColor(colorIndex: string) {
        accentColor.value = colorIndex;
        Utils.updateAccentColor();
    }

    const showLockMessage = ref(false);

    let timeoutRef: any;
    function setEasterEggTheme(number : number) {
        // @ts-ignore
        if(!featuresEnabled.value.specialColorThemes["easterEgg" + number]) {
            showLockMessage.value = true;
            if(timeoutRef) clearTimeout(timeoutRef);

            timeoutRef = setTimeout(() => {
                showLockMessage.value = false;
            }, 3000);
        } else {
            accentColor.value = "easteregg" + number;
            Utils.updateAccentColor();
        }
    }
</script>