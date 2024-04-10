import { createApp } from "vue";
import { createPinia } from "pinia";

import router from "./router/router";
import App from "./App.vue";

import "./assets/css/main.css";

import { socketInit } from "@/socket/socket";
import { usePlanningStore } from '@/stores/planning';
import { useUserDataStore } from "./stores/userdata";
import { usePwaStore } from "./stores/pwa";

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount("#app");

// Init stores
socketInit();
usePwaStore().init();
useUserDataStore().init();
usePlanningStore().init();

// https://polytech-sorbonne.adesoft.com/jsp/custom/modules/plannings/anonymous_cal.jsp?data=e9e155ab9b6657ffb63cb32f5ec6141545c8c1bb728a3ed2b8894bbf6177d16d6250ba3fea2e12caebbcd166cfe884760c76371aa1b72395ddd8a9170e925bdae68b948c5a3eedff2debd32693254264f77e78ccad12ca897793c37046849caf830a08a80ad61523c19edf9c9961f0d4,1