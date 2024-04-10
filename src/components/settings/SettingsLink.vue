<template>
    <router-link :to=to :class="{ 'bg-200': !light  }" class="bg-300 rounded-3xl flex flex-row p-6 items-center">
        <slot></slot>
    </router-link>
</template>

<script setup lang="ts">
    defineProps({
        to: {
            type: String,
            required: true,
        },

        light: {
            type: Boolean,
            required: false,
        },
    });
</script>