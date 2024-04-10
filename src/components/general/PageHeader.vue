<template>
    <div class="flex flex-row gap-4 items-center">
        <LeftArrow @click=$router.go(-1) class="w-14 aspect-square duration-300" />
        <HeaderSmall class="flex-1 color-900 duration-300"> {{ title }} </HeaderSmall>
    </div>
</template>

<script setup lang="ts">
    import HeaderSmall from '@/ui/text/HeaderSmall.vue';
    import LeftArrow from "@/assets/icons/LeftArrow.vue";

    defineProps({
        title: {
            type: String,
            required: true,
        }
    });
</script>