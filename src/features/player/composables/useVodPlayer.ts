import {ref} from "vue";
import {StreamerVodDto} from "@/data/dto/vod/streamerVodDto";
import {vodsApi} from "@/data/api/vods";
import {BoostyVodDto} from "@/data/dto/vod/boostyVodDto";

export function useVodPlayer() {
    const isListLoading = ref(false);
    const isPlayerLoading = ref(false);
    const vodsList = ref<StreamerVodDto[]>([])
    const vodQualityList = ref<BoostyVodDto[]>([])
    const currentVodUrl = ref<string>()

    const getAvailableVods = async (kpId: number) => {
        try {
            isListLoading.value = true;

            const response = await vodsApi.getBoostyVods(kpId)
            vodsList.value = response.data
        } catch (e) {
        } finally {
            isListLoading.value = false;
        }

    }

    const getPlayerLinks = async (vod: StreamerVodDto) => {
        try {
            isPlayerLoading.value = true;

            const response = await vodsApi.getBoostyPlayerLinks(vod.boostyChannel, vod.postId)
            vodQualityList.value = response.data
            currentVodUrl.value =
                response.data.find(vod => vod.quality === "720p")?.url ??
                response.data[0]?.url
        } catch (e) {
        } finally {
            isPlayerLoading.value = false;
        }

    }

    return {
        vodsList,
        vodQualityList,
        currentVodUrl,
        isListLoading,
        isPlayerLoading,
        getAvailableVods,
        getPlayerLinks
    }
}