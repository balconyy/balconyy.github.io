import {baseClient} from "@/data/http";
import {BlobLeaderDto} from "@/data/dto/blobLeaderDto";
import {BlobCheckpointDto} from "@/data/dto/blobCheckpointDto";
import {BlobSyncDto} from "@/data/dto/blobSyncDto";
import {BlobCustomizationDto} from "@/data/dto/blobCustomizationDto";


export const blobApi = {
    syncBlobInfo(score: number) {
        const request: UpdateScoreRequest = {score};

        return baseClient.patch<BlobSyncDto, UpdateScoreRequest>('/blob/sync', request, {
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
    getSkinsList() {
        return baseClient.get<BlobCustomizationDto[]>('/blob/customization', {
            withCredentials: true,
        });
    },

    selectSkin(skinId: string) {
        const request: UpdateSkinRequest = {skinId};

        return baseClient.patch<BlobCheckpointDto, UpdateSkinRequest>(
            '/blob/skin',
            request,
            {withCredentials: true},
        );
    },

    applyPromo(promo: string) {
        return baseClient.post<Boolean>(
            '/blob/promo',
            {promo: promo},
            {withCredentials: true},
        );
    },

};

export interface UpdateScoreRequest {
    score: number;
}

export interface UpdateSkinRequest {
    skinId: string;
}


