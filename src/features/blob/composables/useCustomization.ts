import {ref} from "vue";
import {blobApi} from "@/data/api/blob";
import {BlobCustomizationDto} from "@/data/dto/blobCustomizationDto";

export function useCustomization() {
    const isLoading = ref(false);
    const skins = ref<BlobCustomizationDto[]>([])
    const selected = ref<BlobCustomizationDto>()

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


    return {
        skins,
        selected,
        isLoading,
        getCustomizations,
        selectSkin
    }
}