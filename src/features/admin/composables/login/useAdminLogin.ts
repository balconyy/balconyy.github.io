import {computed, ref} from "vue";
import {adminAuthApi} from "@/data/api/adminAuth";


export function useAdminLogin() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

    const login = ref('')
    const password = ref('')

    const isSuccess = computed(() => state.value === 'success')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)


    const authentication = async () => {
        state.value = 'loading'
        if (login.value === 'admin' && password.value === 'admin') {
            alert("ты долбаёб?? ТЫ, блять, долбаёб????");
            state.value = 'error'
            return;
        }

        try {
            await adminAuthApi.login(login.value, password.value)
            state.value = 'success'
        } catch (e) {
            state.value = 'error'
        }

    }

    return {
        login,
        password,
        isLoading,
        isSuccess,
        error,
        authentication,
    }

}