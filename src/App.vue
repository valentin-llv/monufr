<template>
    <div>
        <router-view v-slot="{ Component, route }">
            <transition :name=route.meta.useTransition>
                <component class="page" :is=Component />
            </transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">
    import { RouterView } from "vue-router";
</script>