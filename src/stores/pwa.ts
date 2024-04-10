import { defineStore } from "pinia";
import { ref, shallowRef, type Ref } from "vue";
import { register } from 'register-service-worker';

export const usePwaStore = defineStore('pwa', () => {
    const updateInstalled: Ref<boolean> = ref(false);
    const newUpdate: Ref<boolean> = ref(false);

    const installPrompt = shallowRef();
    const canInstall: Ref<boolean> = ref(false);

    function init() {
        register(`/serviceWorker.js`, {
            ready() {},
    
            registered() {},
            cached() {},
    
            updatefound() {
                newUpdate.value = true;
            },
    
            updated(registration) {
                let worker = registration.waiting;
                if(!worker) return false;
                
                worker.postMessage({action: 'skipWaiting'});
    
                updateInstalled.value = true;
                newUpdate.value = false;
            },
    
            offline () {},
            error (error) {}
        });
    }

    function installApp(): void {
        installPrompt.value.prompt();

        installPrompt.value.userChoice.then((choiceResult: any) => {
            if(choiceResult.outcome === 'accepted') canInstall.value = false;
        });
    }

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();

        installPrompt.value = event;
        canInstall.value = true;
    });

    return { updateInstalled, newUpdate, canInstall, init, installApp }
});