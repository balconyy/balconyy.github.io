import {baseClient} from "@/data/http";
import {StreamerVodDto} from "@/data/dto/vod/streamerVodDto";
import {BoostyVodDto} from "@/data/dto/vod/boostyVodDto";


export const vodsApi = {
    getBoostyVods(kpId: number) {
        return baseClient.get<StreamerVodDto[]>("/movie/vods", {
            params: {
                kpId,
            },
        });
    },

    getBoostyPlayerLinks(nickname: string, postId: string) {
        return baseClient.get<BoostyVodDto[]>("/movie/vods/player", {
            params: {
                nickname,
                postId,
            },
        });
    },
};
