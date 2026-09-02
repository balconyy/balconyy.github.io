import {JellyRarity} from "@/models/rarity";

export interface BlobCaseInfoDto {
    id: string
    name: string
    rarity: JellyRarity
    quote: string
    image: string
}

export interface BlobCaseResultDto {
    availableSkins: BlobCaseInfoDto[]
    winner: BlobCaseInfoDto
}