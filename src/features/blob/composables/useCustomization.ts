import {ref} from "vue";
import {blobApi} from "@/data/api/blob";
import {BlobCustomizationDto} from "@/data/dto/blobCustomizationDto";

export function useCustomization() {
    const isLoading = ref(false);
    const skins = ref<BlobCustomizationDto[]>([])
    const selected = ref<BlobCustomizationDto>()

    const promoStatus = ref<'idle' | 'applied' | 'error'>('idle')
    const isPromoLoading = ref(false)
    const promoMessage = ref('')

    const getCustomizations = async () => {
        try {
            isLoading.value = true;

            const response = await blobApi.getSkinsList()
            skins.value = response.data
            selected.value = response.data.find(item => item.isSelected)
        } catch (e) {
        } finally {
            isLoading.value = false;
        }

    }

    const selectSkin = async (skin: BlobCustomizationDto) => {
        try {
            selected.value = skin
            await blobApi.selectSkin(skin.id)

        } catch (e) {
        }
    }

    async function applyPromo(code: string): Promise<void> {
        isPromoLoading.value = true
        promoStatus.value = 'idle'
        try {
            const isValid = await blobApi.applyPromo(code)
            if (isValid) {
                promoStatus.value = 'applied'
                const response = await blobApi.getSkinsList()
                skins.value = response.data
            } else {
                promoStatus.value = 'error'
                promoMessage.value = 'Промокод не найден'
            }
        } catch {
            promoStatus.value = 'error'
            promoMessage.value = 'Не удалось применить промокод'
        } finally {
            isPromoLoading.value = false
        }
    }

    return {
        skins,
        selected,
        isLoading,
        promoStatus,
        isPromoLoading,
        promoMessage,
        getCustomizations,
        selectSkin,
        applyPromo
    }
}