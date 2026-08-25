import {JellyRarity} from "@/models/rarity";

export interface BlobCustomizationDto {
    id: string;
    name: string;
    rarity: JellyRarity;
    quote: string;
    image: string;
    unlockMethod: string;
    isUnlocked: boolean;
    isSelected: boolean;
}