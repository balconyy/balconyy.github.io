import '@/assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from "@/router/index.js";
import {useRemoteConfigStore} from "@/store/remoteConfig.ts";
import {createHead} from "@vueuse/head";
import {useUserStore} from "@/store/user.ts";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

const head = createHead()

app.use(pinia)
    .use(head)

useRemoteConfigStore().getConfig().then(() => {})
useUserStore().getAccountInfo().then(() => console.log("user loading end"))

app.use(router)
    .mount("#app")
