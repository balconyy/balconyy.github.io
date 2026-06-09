import {defineStore} from 'pinia'
import {configApi} from "@/data/api/config";
import {Config} from "@/models/config";

export const useRemoteConfigStore = defineStore('remoteConfig', {
    state: () => ({
        remoteConfig: {} as Config,
        loaded: false,
    }),

    actions: {
        async getConfig() {
            try {
                const res = await configApi.getConfig();
                this.remoteConfig = res.data;
            } catch (e) {
                this.remoteConfig = {}
            } finally {
                this.loaded = true
            }
        },
        async setConfig(config: Config) {
            try {
                await configApi.setConfig(config)
                this.remoteConfig = config
                console.log(this.remoteConfig )
            } catch (e) {
                console.error('Failed to send remote config', e)
            }
        },
    },
})