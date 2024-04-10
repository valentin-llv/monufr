<template>
    <div class="flex flex-col">
        <div class="mt-4 flex flex-col gap-4" v-if="(libraryElements as any)['links'].length">
            <LibLink v-for="libElement in (libraryElements as any)['links']" class="flex-1" :element="libElement" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia';

    import { useUserDataStore } from '@/stores/userdata';

    import LibLink from '@/components/library/LibLink.vue';

    const { libraryElements } = storeToRefs(useUserDataStore());
</script>