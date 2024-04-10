<template>
    <div>
        <div class="relative flex-1">
            <router-view v-slot="{ Component, route }">
                <transition :name=route.meta.useTransition>
                    <component class="base rounded-b-4xl " :is=Component />
                </transition>
            </router-view>
        </div>

        <BottomMenu class="-mt-8 bg-red-500"></BottomMenu>
    </div>
</template>

<script setup lang="ts">
    import { RouterView } from "vue-router";

    import BottomMenu from "@/components/general/BottomMenu.vue";
</script>