import {ref} from "vue";

export function useSelectorModal() {
    const showModal = ref(false)

    const openModal = (): void => {
        showModal.value = true
    }

    const closeModal = (): void => {
        showModal.value = false
    }

    return {
        showModal,
        openModal,
        closeModal
    }
}