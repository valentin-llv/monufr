<template>
    <div class="flex flex-col">
        <div class="mb-6" v-if="(libraryElements as any)['notes'].length">
            <HeaderSmall class="color-900"> Vos notes: </HeaderSmall>

            <div class="mt-6 flex flex-wrap gap-4">
                <div class="max-w-[33%] min-w-[28%] flex-1 flex flex-col" v-for="libElement in (libraryElements as any)['notes']">
                    <LibNote class="flex-1" :element="libElement" />
                </div>
            </div>
        </div>

        <hr v-if="(libraryElements as any)['notes'].length && ((libraryElements as any)['mails'].length || (libraryElements as any)['links'].length)" class="ml-6 mr-6 mb-6" />
    
        <div class="mb-6" v-if="(libraryElements as any)['links'].length">
            <HeaderSmall class="color-900"> Vos liens: </HeaderSmall>

            <div class="mt-6 flex flex-col gap-4">
                <LibLink v-for="libElement in (libraryElements as any)['links']" class="flex-1" :element="libElement" />
            </div>
        </div>

        <hr v-if="(libraryElements as any)['mails'].length && (libraryElements as any)['links'].length" class="ml-6 mr-6 mb-6" />

        <div class="mb-6" v-if="(libraryElements as any)['mails'].length">
            <HeaderSmall class="color-900"> Vos contacts: </HeaderSmall>

            <div class="mt-6 flex flex-col gap-4">
                <LibMail v-for="libElement in (libraryElements as any)['mails']" class="flex-1" :element="libElement" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia';

    import { useUserDataStore } from '@/stores/userdata';

    import LibNote from '@/components/library/LibNote.vue';
    import LibLink from '@/components/library/LibLink.vue';
    import LibMail from '@/components/library/LibMail.vue';

    import HeaderSmall from '@/ui/text/HeaderSmall.vue';

    const { libraryElements } = storeToRefs(useUserDataStore());
</script>