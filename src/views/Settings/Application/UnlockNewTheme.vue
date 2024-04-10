<template>
    <div class="base duration-300">
        <PageHeader title="Débloquer un nouveau thème" />

        <!-- Explanation text -->
        <Text class="mt-6 color-900">
            Des Easter Egg ont été dispersé dans l'application. A vous de les retrouver pour gagner des recompenses.
            <br /><br />
            A chaque fois que vous trouverez et terminerez un Easter Egg, un mot de passe vous sera donné pour débloquer la récompense associé.
            <br /><br />
            Bonne chance !
        </Text>

        <!-- Url form -->
        <input v-model="password" @keyup.enter=checkPassword class="mt-6 outline-none rounded-3xl bg-200 p-5 leading-3 text-4xl font-medium color-900" type="text" placeholder="Clé secrète" spellcheck="false" autocapitalize="off" />

        <!-- Send button -->
        <div class="mt-6 p-6 bg-accent rounded-3xl flex gap-6 items-center" @click=checkPassword>
            <Unlock class="h-16 aspect-square" />
            <Text class="color-900 flex-1"> Débloquer </Text>
        </div>

        <div :class="{ 'mt-32': !showLockMessage }" class="fixed top-full duration-200 -translate-y-full left-1/2 -translate-x-1/2 rounded-3xl bg-300 p-6 -mt-8">
            <Text class="text-red-500 text-center">
                Hum,&nbsp;la&nbsp;clé&nbsp;est&nbsp;incorrecte&nbsp;!
            </Text>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useUserDataStore } from '@/stores/userdata';
    import { storeToRefs } from 'pinia';
    import router from '@/router/router';

    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    import Unlock from '@/assets/icons/Unlock.vue';

    const { featuresEnabled } = storeToRefs(useUserDataStore());

    const showLockMessage = ref(false);
    const password = ref();

    let easterEggListPasswords = [
        "17 juillet"
    ];
    let relatedEE = [
        "easterEgg1",
    ];

    let timeoutRef: any;
    function checkPassword() {
        if(easterEggListPasswords.includes(password.value)) {
            // @ts-ignore
            featuresEnabled.value.specialColorThemes[relatedEE[easterEggListPasswords.indexOf(password.value)]] = true;
            router.go(-1);
        } else {
            showLockMessage.value = true;
            if(timeoutRef) clearTimeout(timeoutRef);

            timeoutRef = setTimeout(() => {
                showLockMessage.value = false;
            }, 3000);
        }
    }
</script>