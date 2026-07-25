import {defineStore} from 'pinia'
import {configApi} from "@/data/api/config";
import {Config} from "@/models/config";

export const useRemoteConfigStore = defineStore('remoteConfig', {
    state: () => ({
        remoteConfig: null as Config | null,
        loaded: false,
    }),

    actions: {
        async getConfig() {
            try {
                const res = await configApi.getConfig();
                this.remoteConfig = res.data;
            } catch (e) {
                this.remoteConfig = null;
                console.error('Failed to get remote config', e)
            }
            finally {
                this.loaded = true
            }
        },
        async setConfig(config: Config) {
            try {
                await configApi.setConfig(config)
                this.remoteConfig = config
            } catch (e) {
                console.error('Failed to send remote config', e)
            }
        },
    },
})