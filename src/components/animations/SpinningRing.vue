<template>
    <div class="spinning-ring animate-spin"></div>
</template>

<style scoped>
    .spinning-ring {
        width: 2.25rem;
        height: 2.25rem;
        border: 0.5rem solid;
        border-radius: 100%;
        border-color: var(--color-900) rgba(200, 200, 200, 0.5) rgba(200, 200, 200, 0.5) rgba(200, 200, 200, 0.5);
    }
</style>