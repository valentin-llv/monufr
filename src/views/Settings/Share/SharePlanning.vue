<template>
    <div class="base overflow-hidden">
        <div class="flex-1 overflow-y-auto">
            <PageHeader title="Partager un emploi du temps" />

            <div v-for="planningInfos, index in planningUrls" @click="openBox(index)" class="rounded-3xl bg-200 mt-6 p-6 flex flex-col">
                <div class="flex items-center gap-6">
                    <div class="flex flex-col flex-1">
                        <Text class="color-900">
                            Ajouté le {{ DateManager.getDateText(new Date(planningInfos.date)) }} à {{ DateManager.getHourText(new Date(planningInfos.date)) }}
                        </Text>

                        <Text class="mt-4 color-900 opacity-40 scale-95 -ml-3">
                            {{ planningInfos.url.slice(0, 29) }}
                        </Text>
                    </div>

                    <DownArrow v-if="opennedBox != index + 1" class="h-14 aspect-square" />
                    <Copy v-if="opennedBox == index + 1" @click.stop="copyUrl(index)" class="h-14" />
                </div>

                <div class="overflow-hidden flex flex-col items-center duration-300" :class="{ 'h-0': opennedBox != index + 1, 'h-[353px]': opennedBox == index + 1 }">
                    <img :id='"qrImage" + index' class="h-[300px] aspect-square ml-4 mt-8" />

                    <Text class="color-900 opacity-40 scale-95 -ml-3 text-center">
                        Utilisez l'application MonUFR pour scanner ce code
                    </Text>
                </div>
            </div>

            <!-- User has no planning -->
            <router-link to="/new-planning" v-if="planningUrls.length == 0">
                <div class="w-full pl-6 pr-6 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <Text class="text-center color-900"> Vous n'avez pas d'emploi du temps. Il est peut-etre temps d'en ajouter un ! </Text>

                    <div class="bg-accent p-6 rounded-3xl text-center mt-6">
                        <Text class="color-900"> Ajouter un emploi du temps </Text>
                    </div>
                </div>
            </router-link>
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
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';

    import { useUserDataStore } from '@/stores/userdata';

    import DateManager from '@/static/date-manager';

    // @ts-ignore
    import QRious from 'qrious';

    import PageHeader from "@/components/general/PageHeader.vue";
    import Text from '@/ui/text/Text.vue';

    import DownArrow from '@/assets/icons/DownArrow.vue';
    import Copy from '@/assets/icons/Copy.vue';

    const { planningUrls } = storeToRefs(useUserDataStore());

    const showTextCopiedMsg = ref(false);
    const showCopyErrorMsg = ref(false);

    const opennedBox = ref(0);
    function openBox(index: number) {
        opennedBox.value = opennedBox.value == index + 1 ? 0 : index + 1;

        var qr = new QRious({
            background: 'transparent',
            foreground: '#faf7f7',
            size: 380,
            padding: 0,
            value: planningUrls.value[index].url,
        });

        // @ts-ignore
        document.getElementById('qrImage' + index).src = qr.image.src;
    }

    let timeoutRef: any;
    function copyUrl(index: number) {
        if(navigator.clipboard) {
            navigator.clipboard.writeText(planningUrls.value[index].url).then(() => {
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

<style scoped>

</style>@/static/date-manager