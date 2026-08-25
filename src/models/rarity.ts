export enum JellyRarity {
    COMMON = "COMMON",
    UNCOMMON = "UNCOMMON",
    RARE = "RARE",
    EPIC = "EPIC",
    LEGENDARY = "LEGENDARY",
}

export const RARITY_COLORS: Record<JellyRarity, string> = {
    [JellyRarity.COMMON]: '#9aa0a6',
    [JellyRarity.UNCOMMON]: '#4caf50',
    [JellyRarity.RARE]: '#4a90e2',
    [JellyRarity.EPIC]: '#a24ae2',
    [JellyRarity.LEGENDARY]: '#e2a94a',
}