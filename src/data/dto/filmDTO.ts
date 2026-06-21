export interface MovieResponseDto {
    movieInfo: MovieInfoDto
    timings: Timing[]
    relations: Relation[]
}

export interface MovieInfoDto {
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

export type RelationType = 'SEQUEL' | 'PREQUEL' | 'SPIN_OFF' | string