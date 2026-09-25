import {computed, ref} from "vue";
import {vodsApi} from "@/data/api/vods";
import {BoostyMovieCardDto} from "@/data/dto/vod/boostyMovieCardDto";

// Должен совпадать с размером страницы на бэкенде — используется только
// чтобы понять, есть ли следующая страница, раз эндпоинт не отдаёт total count
const PAGE_SIZE = 40

export function useMovieVods() {
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    const vods = ref<BoostyMovieCardDto[]>([])
    const page = ref(0)

    const hasNextPage = computed(() => vods.value.length === PAGE_SIZE)

    const getStreamerVods = async (nickname: string, pageNumber: number = 0) => {
        vods.value = []
        isLoading.value = true
        error.value = null
        try {
            const response = await vodsApi.getStreamerVodsByPage(nickname, pageNumber)
            vods.value = response.data
            page.value = pageNumber
        } catch (e) {
            error.value = e as Error
            console.error(e)
        } finally {
            isLoading.value = false
        }
    }

    return {
        vods,
        isLoading,
        error,
        page,
        hasNextPage,
        getStreamerVods
    }
}