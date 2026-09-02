import {ref} from "vue";
import {blobApi} from "@/data/api/blob";
import axios from "axios";
import {BlobCaseInfoDto} from "@/data/dto/blobCaseInfoDto";

export function useCaseOpener() {
    const isBalanceLoading = ref(false);
    const isEquipLoading = ref(false);
    const isCaseLoading = ref(false);
    const isRouletteOpen = ref(false);

    const balance = ref<number | null>(null);

    const availableSkins = ref<BlobCaseInfoDto[]>([]);
    const winner = ref<BlobCaseInfoDto | null>(null);
    const caseError = ref<string | null>();

    const getBalance = async () => {
        try {
            isBalanceLoading.value = true;
            const response = await blobApi.getBalance()
            balance.value = response.data.balance;
        } catch (e) {
        } finally {
            isBalanceLoading.value = false;
        }

    }

    const openJellyCase = async () => {
        try {
            isRouletteOpen.value = false;
            isCaseLoading.value = true;
            try {
                const response = await blobApi.openCase()
                availableSkins.value = response.data.availableSkins;
                winner.value = response.data.winner;

                await getBalance();
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    switch (err.response?.status) {
                        case 402:
                            caseError.value = 'Недостаточно средств'
                            break;
                        case 409:
                            caseError.value = 'Скинов не осталось =('
                            break;
                        default:
                            caseError.value = 'Что-то пошло не так..'
                    }
                }

            }
        } finally {
            isCaseLoading.value = false;
            isRouletteOpen.value = true;
        }
    }

    const selectSkin = async (skinId: string) => {
        try {
            isEquipLoading.value = true
            await blobApi.selectSkin(skinId)
        } catch (e) {
        } finally {
            isEquipLoading.value = false;
            endRoulette()
        }
    }

    const endRoulette = () => {
        isRouletteOpen.value = false;
    }


    return {
        isRouletteOpen,
        isBalanceLoading,
        isEquipLoading,
        isCaseLoading,
        balance,
        availableSkins,
        winner,
        caseError,
        getBalance,
        openJellyCase,
        selectSkin,
        endRoulette
    }
}