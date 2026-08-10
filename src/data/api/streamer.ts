import {baseClient} from "@/data/http";
import {StreamerRatingDto} from "@/data/dto/streamerRatingDto";

export const streamersApi = {
    getStreamerRating(kpId: number) {
        return baseClient.get<StreamerRatingDto[]>(`/streamers/rating/${kpId}`);
    }
};