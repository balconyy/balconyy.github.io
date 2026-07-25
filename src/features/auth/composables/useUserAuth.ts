import {useRoute} from "vue-router";
import {computed, ref} from "vue";
import {useUserStore} from "@/store/user";

export function useUserAuth() {
    const userStore = useUserStore();
    const isLoading = computed(() => !userStore.loaded || loading.value);
    const user = computed(() => userStore.user);
    const loading = ref(false);

    const route = useRoute()
    const login = () => {
        loading.value = true;
        const path = route.fullPath
        window.location.href = `${import.meta.env.VITE_API_URL}/login?path=${encodeURIComponent(path)}`
    }
    const logout = async () => {
        try {
            loading.value = true;
            await userStore.logout()
        } catch (e) {

        } finally {
            loading.value = false;
        }

    }

    return {
        user,
        isLoading,
        login,
        logout
    }
}
