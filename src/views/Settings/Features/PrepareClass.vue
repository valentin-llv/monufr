<template>
    <div class="base">
        <PageHeader title="Préparation des cours" />

        <!-- Enable feature toogle start -->
        <label class="flex flex-row items-center p-6 bg-200 mt-6 rounded-3xl gap-6">
            <Text class="color-900 flex-1"> Activer la fonctionnalité de préparation des cours </Text>

            <input v-model=featuresEnabled.prepareClass type="checkbox" class="peer hidden" />
            <span :class="{ 'bg-accent': featuresEnabled.prepareClass }" class="checkbox w-24 h-14 flex p-3 bg-300 rounded-full duration-300 after:w-8 after:h-8 after:rounded-full after:duration-300 peer-checked:after:translate-x-10"></span>
        </label>
    </div>
</template>

<script setup lang="ts">
    import { useUserDataStore } from '@/stores/userdata';
    import { storeToRefs } from 'pinia';

    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    const { featuresEnabled } = storeToRefs(useUserDataStore());
</script>