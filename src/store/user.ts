import {defineStore} from "pinia";
import {User} from "@/models/user";
import {userApi} from "@/data/api/user";

export const useUserStore = defineStore('userInfo', {
    state: () => ({
        user: null as User | null,
        loaded: false,
    }),

    actions: {
        async getAccountInfo() {
            try {
                this.loaded = false;
                const res = await userApi.me();
                this.user = res.data;
            } catch (e) {
                this.user = null;
                console.error('Failed to get account', e)
            } finally {
                this.loaded = true
            }
        },
        async logout() {
            try {
                this.loaded = false;
                await userApi.logout();
                this.user = null;
            } catch (e) {
                console.error('Failed to get remote config', e)
            } finally {
                this.loaded = true
            }
        }
    },
})