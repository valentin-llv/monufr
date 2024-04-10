<template>
    <div :id="'eventId' + event.uid + ($router.currentRoute.value.name as string) + (small ? 'small' : '')" @click="goto('/event')">
        <div class="relative mt-4 flex">
            <div class="relative w-32">
                <p class="text-4xl color-900 font-bold"> {{ event.start.getHours() }}h{{ event.start.getMinutes() < 10 ? '0' + event.start.getMinutes() : event.start.getMinutes() }} </p>
                <Text class="color-900 mt-2"> {{ event.end.getHours() }}h{{ event.end.getMinutes() < 10 ? '0' + event.end.getMinutes() : event.end.getMinutes() }} </Text>
            </div>

            <div class="relative flex-1 p-6 pl-8 rounded-3xl rounded-l-none" :class="{ 'bg-200': !small, 'bg-300': small }">
                <div v-if="!eventsColors[event.summary]" class="absolute w-2 h-full top-0 left-0 ml-0.5 rounded-full bg-accent"></div>
                <div v-if="eventsColors[event.summary]" :style="{ 'background-color': eventsColors[event.summary].color1 }" class="absolute w-2 h-full top-0 left-0 ml-0.5 rounded-full"></div>

                <Text class="color-900 pr-16"> {{ event.summary }} </Text>
                <Text v-if="!small" class="z-20 color-900 mt-2 pr-16"> {{ event.teacher }} </Text>

                <Text v-if="!small" class="color-900 mt-6"> {{ Math.trunc(event.duration / 60) }}h{{ event.duration % 60 < 10 ? '0' + event.duration % 60 : event.duration % 60 }} </Text>
                <Text v-if="!small" class="color-900"> {{ event.location }} </Text>

                <div v-if="!small && accentColor == 'easteregg3'" class="z-0 absolute top-0 left-0 w-full h-full flex flex-row items-end justify-end">
                    <img src="@/assets/images/theme/easter.svg" class="h-40 m-5" />
                </div>
            </div>

            <Transition name="fade">
                <div v-if="classPrepared.includes(event.uid) && !small" class="absolute left-full -translate-x-full -ml-6 mt-6 p-1 rounded-2xl bg-accent-gradient">
                    <CheckMark class="h-12 aspect-square" />
                </div>
            </Transition>
        </div>
        
        <div v-if="eventsNotes[event.uid]" @click.stop="goto('/event/edit-note')" :class="{ 'bg-accent': !edit, 'bg-200': edit, 'mb-6': !small && !edit }" class="p-6 mt-4 flex flex-col rounded-3xl">
            <div v-if="edit" class="mb-5 flex gap-5 items-center">
                <Edit class="h-16" />
                <Text class="color-900 mt-2"> Editer la note </Text>
            </div>

            <Text :class="{ 'bg-accent rounded-2xl p-6': edit }" class="flex-1 color-900" v-html="eventsNotes[event.uid].content.replaceAll('\n', '<br />')"></Text>
        </div>

        <Teleport to="body">
            <PopupBase :show="showLongPressModal" @close="showLongPressModal = false">
                <div class="bg-200 rounded-3xl p-6 flex flex-col gap-6">
                    <Text class="mt-2 mb-2 color-900 !font-bold"> {{ event.summary }} </Text>

                    <div @click="toogleClassReady" class="relative rounded-2xl bg-300 p-6 flex items-center overflow-hidden">
                        <Text v-html=classReadyButtonText :class="{ '': classPrepared.includes(event.uid), 'flex-1': !classPrepared.includes(event.uid) }" class="text-center duration-300 color-900"></Text>

                        <div :class="{ 'ml-40': !classPrepared.includes(event.uid) }" class="absolute left-full -translate-x-full duration-300 pr-20 p-4 bg-accent">
                            <CheckMark class="h-14" />
                        </div>
                    </div>

                    <hr class="ml-6 mr-6" />

                    <div v-if="!eventsNotes[event.uid]" @click.prevent="showLongPressModal = false; goto('/event/edit-note')" class="rounded-2xl bg-300 p-6 flex gap-6 items-center justify-center">
                        <Note class="h-16" />
                        <Text class="color-900"> Ajouter une note </Text>
                    </div>

                    <div v-if="eventsNotes[event.uid]" @click.prevent="showLongPressModal = false; goto('/event/edit-note')" class="rounded-2xl bg-300 p-6 flex gap-6 items-center justify-center">
                        <Edit class="h-16" />
                        <Text class="color-900"> Editer la note </Text>
                    </div>

                    <div @click.prevent="showLongPressModal = false; goto('/event/hide-event')" class="rounded-2xl bg-300 p-6 flex gap-6 items-center justify-center">
                        <Hide class="h-16" />
                        <Text class="color-900"> Masquer le cours </Text>
                    </div>

                    <!-- Color selection section start -->
                    <div class="flex justify-center p-6 bg-300 rounded-3xl">
                        <div class="color-grid">
                            <div v-for="index in accents" @click="toggleEventAccentColor(index)" :style="{ backgroundColor: index }" :class="{ 'border-900': ( eventsColors[event.summary] && eventsColors[event.summary].color1 == index) }" class="h-12 w-12 duration-300 rounded-full border-3 border-transparent"></div>
                        </div>
                    </div>
                </div>

                <div @click="showLongPressModal = false" class="bg-red-400 rounded-full p-6 mt-6 flex justify-center">
                    <Text class="color-900"> Fermer </Text>
                </div>
            </PopupBase>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
    import { onBeforeUnmount, onMounted, ref } from 'vue';
    import router from '@/router/router';
    import { storeToRefs } from 'pinia';

    import { useUserDataStore } from '@/stores/userdata';
    import { usePlanningStore } from '@/stores/planning';
    import type { PlanningEvent } from '@/static/planning-parser';

    import GlobalVars from '@/static/globalVars';

    import PopupBase from '@/components/popup/PopupBase.vue';

    import Text from '@/ui/text/Text.vue';

    import Edit from '@/assets/icons/Edit.vue';
    import CheckMark from '@/assets/icons/Checkmark.vue';
    import Hide from '@/assets/icons/Hide.vue';
    import Note from '@/assets/icons/Note.vue';

    const { eventsNotes, classPrepared, eventsColors, accentColor } = storeToRefs(useUserDataStore());

    const showLongPressModal = ref(false);

    const accents = ref(GlobalVars.accents);

    const props = defineProps({
        event: {
            type: Object,
            required: true,
        },

        edit: {
            type: Boolean,
            required: false,
        },

        small: {
            type: Boolean,
            required: false,
        },
    });

    function goto(to: string) {
        usePlanningStore().selectedEvent = props.event as PlanningEvent;
        router.push(to);
    }

    function openLongPressModal() {
        window.navigator.vibrate(35);
        showLongPressModal.value = true;
    }

    const pageRouteName = router.currentRoute.value.name;
    onMounted(() => {
        if(!props.edit) {
            // @ts-ignore
            document.getElementById('eventId' + props.event.uid + pageRouteName + (props.small ? 'small' : '')).addEventListener("contextmenu", openLongPressModal);
        }
    });

    onBeforeUnmount(() => {
        if(!props.edit) {
            // @ts-ignore
            document.getElementById('eventId' + props.event.uid + pageRouteName + (props.small ? 'small' : '')).removeEventListener("contextmenu", openLongPressModal);
        }
    });

    const classReadyButtonText = ref(classPrepared.value.includes(props.event.uid) ? "Fait" : "A&nbsp;faire");
    function toogleClassReady() {
        if(classPrepared.value.includes(props.event.uid)) {
            classPrepared.value.splice(classPrepared.value.indexOf(props.event.uid), 1);
            setTimeout(() => {
                classReadyButtonText.value = "A&nbsp;faire";
            }, 100);
        }
        else {
            classPrepared.value.push(props.event.uid);
            setTimeout(() => {
                classReadyButtonText.value = "Fait";
            }, 100);
        }
    }

    function toggleEventAccentColor(colorIndex: string) {
        eventsColors.value[props.event.summary] = {
            color1: colorIndex,
        }
    }
</script>@/static/planning-downloader