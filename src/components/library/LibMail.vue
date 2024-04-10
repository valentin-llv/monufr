<template>
    <div class="overflow-hidden bg-200 rounded-3xl flex flex-col p-6" @click="goto('/library/edit-item')">
        <div class="flex gap-4 items-center">
            <At class="h-12 aspect-square" />
            <Text class="color-900"> {{ element.title }} </Text>
        </div>

        <a @click.stop="" target="_blank" :href="'mailto:' + element.content" class="mt-6"><div class="bg-300 rounded-2xl p-6 flex flex-row items-center gap-6">
            <Text class="text-blue-400 flex-1 line-clamp-3"> {{ element.content }} </Text>
            <Copy @click.prevent.stop="copyUrl" class="h-14 aspect-square" />
        </div></a>

        <div :class="{ 'mt-32': !showTextCopiedMsg }" class="z-50 fixed top-full duration-200 -translate-y-full left-1/2 -translate-x-1/2 rounded-2xl bg-300 p-6 pl-32 pr-32 -mt-8 shadow-xl shadow-gray-90">
            <Text class="color-900 text-center">
                Url&nbsp;copié
            </Text>
        </div>

        <div :class="{ 'mt-32': !showCopyErrorMsg }" class="z-50 fixed top-full duration-200 -translate-y-full left-1/2 -translate-x-1/2 rounded-2xl bg-300 p-6 pl-20 pr-20 -mt-8 shadow-xl shadow-gray-90">
            <Text class="text-red-500 text-center">
                Impossible&nbsp;de&nbsp;copier le&nbsp;texte&nbsp;avec&nbsp;cet&nbsp;appareil&nbsp;!
            </Text>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import router from '@/router/router';

    import { useUserDataStore, type LibraryElement } from '@/stores/userdata';

    import Text from '@/ui/text/Text.vue';

    import Copy from '@/assets/icons/Copy.vue';
    import At from '@/assets/icons/At.vue';

    const props = defineProps({
        element: {
            type: Object,
            required: true,
        },
    });

    function goto(to: string) {
        useUserDataStore().selectedElement = props.element as LibraryElement;
        router.push(to);
    }

    const showTextCopiedMsg = ref(false);
    const showCopyErrorMsg = ref(false);

    let timeoutRef: any;
    function copyUrl() {
        if(navigator.clipboard) {
            navigator.clipboard.writeText(props.element.content).then(() => {
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