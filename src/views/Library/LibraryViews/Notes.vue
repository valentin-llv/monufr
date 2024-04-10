<template>
    <div class="flex flex-col">
        <div class="flex flex-wrap gap-4 mt-4" v-if="(libraryElements as any)['notes'].length">
            <div class="max-w-[33%] min-w-[28%] flex-1 flex flex-col" v-for="libElement in (libraryElements as any)['notes']">
                <LibNote class="flex-1" :element="libElement" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia';

    import { useUserDataStore } from '@/stores/userdata';

    import LibNote from '@/components/library/LibNote.vue';

    const { libraryElements } = storeToRefs(useUserDataStore());
</script>