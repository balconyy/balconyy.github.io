import {Player} from "../../models/player";


export interface MovieResponseDto {
    movieInfo: MovieInfo
    players: Player[]
    timings: Timing[]
    relations: Relation[]
    reviews: ReviewResponseDto[]
}

export interface MovieInfo {
    kpId: number
    imdbId: string
    titleMain: string
    titleSub: string
    posterUrl: string
    year: number
    type: string
    ratingKinopoisk: number
    ratingKinopoiskVoteCount: number
    ratingImdb: number
    ratingImdbVoteCount: number
}

export interface Timing {
    username: string
    timingText: string
}

export interface Relation {
    kpId: number
    poster: string
    name: string
    type: RelationType
}

export interface ReviewResponseDto {
    letterboxdAccount : LetterboxdAccount
    review : Review
}

export interface LetterboxdAccount {
    id: number
    name: string
    displayName: string
    avatar?: string | null
}

export interface Review {
    movieSlug: string
    rating?: number | null
    text: string
    date: string
}

export type RelationType = 'SEQUEL' | 'PREQUEL' | 'SPIN_OFF' | string