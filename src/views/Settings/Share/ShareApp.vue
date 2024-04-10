<template>
    <div class="base overflow-hidden">
        <div class="flex-1 overflow-y-auto">
            <PageHeader title="Partager l'app" />

            <Text class="color-900 mt-6">
                Pour partager l'application, vous pouvez copier l'url ci-dessous, ou bien utiliser le qrcode.
            </Text>

            <div class="rounded-3xl bg-200 mt-6 p-6 gap-6 flex flex-row items-center">
                <Text class="color-accent flex-1"> https://app.monufr.fr </Text>
                <Copy @click="copyUrl" class="h-14 aspect-square" />
            </div>

            <div class="rounded-3xl bg-200 mt-6 flex flex-row justify-center items-center">
                <AppQrCode class="w-full max-w-2xl" />
            </div>
        </div>

        <div class="relative flex justify-center">
            <div :class="{ 'translate-y-full': !showTextCopiedMsg }" class="absolute rounded-3xl bg-300 p-6 -translate-y-full duration-200 text-center">
                <Text class="color-900"> Url copié dans votre presse papier </Text>
            </div>

            <div :class="{ 'translate-y-full': !showCopyErrorMsg }" class="absolute rounded-3xl bg-300 p-6 -translate-y-full duration-200 text-center">
                <Text class="text-red-500">
                    Impossible de copier le texte avec cet appareil !
                </Text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    import Copy from '@/assets/icons/Copy.vue';
    import AppQrCode from '@/assets/images/AppQrCode.vue';

    const showTextCopiedMsg = ref(false);
    const showCopyErrorMsg = ref(false);

    let timeoutRef: any;
    function copyUrl() {
        if(navigator.clipboard) {
            navigator.clipboard.writeText("https://app.monufr.fr").then(() => {
                showTextCopiedMsg.value = true;
                window.navigator.vibrate(50);

                if(timeoutRef) {
                    clearTimeout(timeoutRef);
                    showCopyErrorMsg.value = false;
                }

                timeoutRef = setTimeout(() => {
                    showTextCopiedMsg.value = false;
                }, 3000);
            }).catch(() => {
                showCopyErrorMsg.value = true;

                if(timeoutRef) {
                    clearTimeout(timeoutRef);
                    showTextCopiedMsg.value = false;
                }

                timeoutRef = setTimeout(() => {
                    showCopyErrorMsg.value = false;
                }, 3000);
            });
        } else {
            showCopyErrorMsg.value = true;

            timeoutRef = setTimeout(() => {
                showCopyErrorMsg.value = false;
            }, 3000);
        }
    }
</script>