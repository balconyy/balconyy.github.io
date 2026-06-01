import '@/assets/main.css'

import {createApp, watchEffect} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from "@/router/index.js";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
    .use(router)
    .mount('#app')
