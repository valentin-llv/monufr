<template>
    <div class="overflow-hidden" @click="goto('/library/edit-item')">
        <div class="bg-200 rounded-3xl p-6 h-[150px] flex">
            <Text v-html="element.content.replaceAll('\n', '<br />')" class="color-900 !text-2xl overflow-hidden"></Text>
        </div>

        <Text v-if="element.title" class="color-900 mt-3 ml-3 whitespace-nowrap text-ellipsis overflow-hidden !text-3xl"> {{ element.title }} </Text>
        <Text v-if="!element.title" class="color-900 mt-3 ml-3 whitespace-nowrap text-ellipsis overflow-hidden !text-3xl"> Crée le {{ dateText }} </Text>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import router from '@/router/router';

    import { useUserDataStore, type LibraryElement } from '@/stores/userdata';

    import Text from '@/ui/text/Text.vue';

    const props = defineProps({
        element: {
            type: Object,
            required: true,
        },
    });

    const dateText = computed(() => {
        let date = new Date(props.element.date);

        return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" + (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth());
    });

    function goto(to: string) {
        useUserDataStore().selectedElement = props.element as LibraryElement;
        router.push(to);
    }
</script>