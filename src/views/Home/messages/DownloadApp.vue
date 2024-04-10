<template>
    <div>
        <!-- Download app -->
        <div v-if=canInstall @click=pwaStore.installApp class="rounded-3xl bg-accent flex flex-row p-6 items-center mb-6 gap-6">
            <DownloadIcon class="w-14" />
            <Text class="flex-1 color-900">Télécharger l'application</Text>
        </div>

        <!-- Download for iPhone -->
        <router-link to="/help/install-on-ios">
            <div v-if="Utils.isIOS() && !installOnIosSeen && !canInstall" class="rounded-3xl bg-accent flex flex-row p-6 items-center mb-6 gap-6">
                <DownloadIcon class="w-14" />
                <Text class="flex-1 color-900">Télécharger l'application</Text>
            </div>
        </router-link>

        <!-- New update downloaded -->
        <div v-if="updateInstalled && !canInstall" @click=reloadPage class="rounded-3xl bg-accent flex flex-col p-6 mb-6">
            <Text class="color-900"> 
                Une nouvelle mise à jour de l'application est disponible. Cliquez ici pour l'installer.
            </Text>

            <div class="flex gap-6 mt-4 items-center">
                <Reload class="w-14" />
            
                <Text class="flex-1 color-900"> 
                    L'application va redemarer.
                </Text>
            </div>
        </div>

        <!-- New update downloading -->
        <div v-if="newUpdate && !canInstall" class="rounded-3xl bg-accent flex flex-row p-6 gap-6 mb-6">
            <Text class="color-900"> Une nouvelle mise à jour est en cours de téléchargement. Elle sera bientôt installé </Text>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia';

    import { usePwaStore } from '@/stores/pwa';
    import { useUserDataStore } from '@/stores/userdata';

    import Utils from '@/static/utils';

    import Text from '@/ui/text/Text.vue';

    import DownloadIcon from '@/assets/icons/DownloadIcon.vue';
    import Reload from '@/assets/icons/Reload.vue';

    const { installOnIosSeen } = storeToRefs(useUserDataStore());
    let pwaStore = usePwaStore();
    const { updateInstalled, newUpdate, canInstall } = storeToRefs(usePwaStore());

    function reloadPage() { window.location.reload(); }
</script>

<style scoped>

</style>