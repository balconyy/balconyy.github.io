import '@/assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from "@/router/index.js";
import {useRemoteConfigStore} from "@/store/remoteConfig.ts";
import {createHead} from "@vueuse/head";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

const head = createHead()

app.use(pinia)
    .use(head)

useRemoteConfigStore().getConfig().then(() => console.log("config loading end"))

app.use(router)
    .mount("#app")
