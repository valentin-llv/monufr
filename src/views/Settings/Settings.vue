<template>
    <div class="base">
        <PageHeader title="Paramètres" />

        <SettingsLink class="mt-6 gap-6" to="/help">
            <Help class="h-16" />
            <Text class="color-900"> Aide </Text>
        </SettingsLink>

        <SettingsLink class="mt-6 gap-6" to="/help/bug-report">
            <Bug class="h-16" />
            <Text class="color-900"> Signaler un problème </Text>
        </SettingsLink>

        <HeaderSmall class="color-900 mt-10 mb-6"> Application </HeaderSmall>

        <SettingsLink class="gap-6" to="/settings/appearance">
            <Palette class="h-16" />
            <Text class="color-900"> Apparence </Text>
        </SettingsLink>

        <HeaderSmall class="color-900 mt-10 mb-6"> Fonctionnalités </HeaderSmall>

        <SettingsLink class="gap-6" to="/settings/planning-feature">
            <Calendar class="h-16 stroke-900 fill-900" />
            <Text class="color-900"> Emploi du temps </Text>
        </SettingsLink>

        <SettingsLink class="mt-6 gap-6" to="/settings/prepare-class-feature">
            <Book class="h-16" />
            <Text class="color-900"> Préparation des cours </Text>
        </SettingsLink>

        <HeaderSmall class="color-900 mt-10 mb-6"> Partage </HeaderSmall>

        <SettingsLink class="gap-6" to="/settings/share/app">
            <Phone class="h-16" />
            <Text class="color-900"> Partager l'application </Text>
        </SettingsLink>

        <SettingsLink class="mt-6 gap-6" to="/settings/share/planning">
            <Calendar class="h-16 stroke-900 fill-900" />
            <Text class="color-900"> Partager votre emploi du temps </Text>
        </SettingsLink>

        <HeaderSmall class="color-900 mt-10 mb-6"> Crédits </HeaderSmall>

        <!-- Credits -->
        <div @click="easterClick" class="rounded-3xl bg-200 p-6 flex flex-col">
            <Text class="color-900">
                Application réalisée par:
                <span class="color-accent">Valentin Le Lièvre</span>
            </Text>

            <Text class="color-900 mt-2 text-left pointer-events-auto">
                Portfolio: <a target="_blank" href="https://valentin-lelievre.com" class="text-blue-400">valentin-lelievre.com</a>
            </Text>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, type Ref } from "vue";

    import PageHeader from "@/components/general/PageHeader.vue";
    import SettingsLink from "@/components/settings/SettingsLink.vue";

    import HeaderSmall from '@/ui/text/HeaderSmall.vue';
    import Text from '@/ui/text/Text.vue';

    import Help from '@/assets/icons/Help.vue';
    import Phone from '@/assets/icons/Phone.vue';
    import Calendar from '@/assets/icons/Calendar.vue';
    import Palette from '@/assets/icons/Palette.vue';
    import Book from '@/assets/icons/Book.vue';
    import Bug from '@/assets/icons/Bug.vue';

    // Easter egg: mini game
    const clickCount: Ref<number> = ref(0);
    let timeOut: number;
    function easterClick() {
        // clickCount.value += 1;

        // if(clickCount.value == 7) router.push("/easter-egg/mini-game");

        // if(timeOut)  clearTimeout(timeOut);
        // timeOut = setTimeout(() => {
        //     clickCount.value = 0;
        // }, 5000);
    }
</script>