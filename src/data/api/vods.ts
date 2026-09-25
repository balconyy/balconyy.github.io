import {baseClient} from "@/data/http";
import {BoostyPostDto} from "@/data/dto/vod/boostyPostDto";
import {BoostyVodDto} from "@/data/dto/vod/boostyVodDto";
import {VodsCountDto} from "@/data/dto/vod/vodsCountDto";
import {BoostyMovieCardDto} from "@/data/dto/vod/boostyMovieCardDto";


export const vodsApi = {
    getBoostyVods(kpId: number) {
        return baseClient.get<BoostyPostDto[]>("/movie/vods", {
            params: {
                kpId,
            },
        });
    },

    getBoostyPlayerLinks(nickname: string, postId: string, vid: number) {
        return baseClient.get<BoostyVodDto[]>("/movie/vods/player", {
            params: {
                nickname,
                postId,
                vid,
            },
        });
    },

    getStreamersVodsCount() {
        return baseClient.get<VodsCountDto[]>("/vod/streamers");
    },

    getStreamerVodsByPage(nickname: string, page: number) {
        return baseClient.get<BoostyMovieCardDto[]>(`/vod/streamer/${nickname}`, {
            params: {
                page,
            },
        });
    },
};
