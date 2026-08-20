import {baseClient} from "@/data/http";
import {BlobLeaderDto} from "@/data/dto/blobLeaderDto";
import {BlobCheckpointDto} from "@/data/dto/blobCheckpointDto";


export const blobApi = {
    syncBlobInfo(score: number) {
        const request: UpdateScoreRequest = {score};

        return baseClient.patch<BlobCheckpointDto, UpdateScoreRequest>('/blob/sync', request, {
            withCredentials: true,
        });
    },

    saveScore(score: number) {
        const request: UpdateScoreRequest = {score};

        return baseClient.patch<BlobCheckpointDto, UpdateScoreRequest>(
            '/blob/score',
            request,
            {withCredentials: true},
        );
    },

    getLeaderboard() {
        return baseClient.get<BlobLeaderDto[]>('/blob/leaderboard', {
            withCredentials: true,
        });
    },
};

export interface UpdateScoreRequest {
    score: number;
}

