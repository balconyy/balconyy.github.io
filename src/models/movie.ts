export interface Movie {
    kpId: number;
    titleMain: string;
    titleSecond?: string;
    posterUrl?: string;
    year?: string;
    type: string;
    ratingKP?: string;
}

export interface MovieExtended extends Movie {
    imdbId?: string;
    ratingKp?: string;
    ratingImdb?: string;
    kpVoteCount?: number;
    imdbVoteCount?: number;
}