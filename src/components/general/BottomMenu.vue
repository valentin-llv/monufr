<template>
    <div class="h-36 pt-8 flex flex-row bg-200 test">
        <div class="flex flex-1 justify-center items-center">
            <router-link to="/" class="duration-300 stroke-gradient" :class="{ 'stroke-900 opacity-60': $router.currentRoute.value.name != 'home' }">
                <Dashboard class="h-18" />
            </router-link>
        </div>

        <div class="flex flex-1 justify-center items-center">
            <router-link to="/planning" class="duration-300 stroke-gradient fill-gradient" :class="{ 'stroke-900 fill-900 opacity-60': $router.currentRoute.value.name != 'planning' }">
                <Calendar class="h-18" />
            </router-link>
        </div>

        <div class="flex flex-1 justify-center items-center">
            <router-link to="/library" class="duration-300 stroke-gradient" :class="{ 'stroke-900 opacity-60': $router.currentRoute.value.name != 'library' }">
                <Drawer class="h-18" />
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { RouterLink } from 'vue-router';

    import Dashboard from '@/assets/icons/Dashboard.vue';
    import Calendar from '@/assets/icons/Calendar.vue';
    import Drawer from '@/assets/icons/Drawer.vue';
</script>

<style scoped>


.test {
    box-shadow: inset 0px 16px 40px -14px rgba(0, 0, 0, 0.6);
}
</style>