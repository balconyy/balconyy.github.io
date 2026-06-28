export interface MovieAddonDto {
    timings: Timing[]
    relations: Relation[]
    reviews: ReviewResponse[]
}


export interface Timing {
    username: string
    timingText: string
}

export interface ReviewResponse {
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

export interface Relation {
    kpId: number
    poster: string
    name: string
    type: RelationType
}



export type RelationType = 'SEQUEL' | 'PREQUEL' | 'SPIN_OFF' | string
