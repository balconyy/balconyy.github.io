export interface StreamerRatingDto {
    nickname: string
    displayName: string
    followers: number
    avatar: string
    kpProfile: string
    rating: number
    twitchLink?: string | null,
    otherLink?: string | null,
}