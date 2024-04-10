<template>
    <div class="flex flex-col">
        <div class="mt-4 flex flex-col gap-4" v-if="(libraryElements as any)['mails'].length">
            <LibMail v-for="libElement in (libraryElements as any)['mails']" class="flex-1" :element="libElement" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia';

    import { useUserDataStore } from '@/stores/userdata';

    import LibMail from '@/components/library/LibMail.vue';

    const { libraryElements } = storeToRefs(useUserDataStore());
</script>