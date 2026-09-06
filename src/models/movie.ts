export interface MovieInfo {
    titleMain: string;
    titleSecond?: string;
    year: number | null;
    type: string;
    kpId: number;
    posterUrl: string;
    imdbId?: string | null;
    tmdbId?: string | null;
    lbSlug?: string | null;
}