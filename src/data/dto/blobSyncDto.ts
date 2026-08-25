import {BlobCharacteristic} from "@/models/blobCharacteristic";

export interface BlobSyncDto {
    checkpoint: number;
    score: number;
    characteristic: BlobCharacteristic;
}
