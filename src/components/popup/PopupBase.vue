<template>
    <transition name="modal">
        <div v-if="show" class="modal-mask">
            <div @click="$emit('close')" class="absolute top-0 left-0 h-full w-full"></div>

            <div class="slot absolute w-full top-full -translate-y-full duration-300 flex flex-col p-6 pb-10">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
    defineProps({
        show: Boolean,
    });
</script>

<style>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        transition: all 0.3s ease;
        overflow: hidden;
        opacity: 1;
    }

    .modal-enter-from, .modal-leave-to {
        opacity: 0;
    }

    .modal-enter-from .slot, .modal-leave-to .slot {
        margin-top: 350px;
    }
</style>