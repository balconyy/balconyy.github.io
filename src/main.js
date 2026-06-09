import '@/assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from "@/router/index.js";
import {useRemoteConfigStore} from "@/store/remoteConfig.ts";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(router)
    .use(pinia)
    .mount("#app")

useRemoteConfigStore().getConfig().then(() => console.log("config gotten"))

