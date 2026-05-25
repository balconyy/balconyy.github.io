export interface Movie {
    id: number;
    titleMain: string;
    titleSecond?: string;
    posterUrl?: string;
    year: string;
    type: string;
    ratingKP?: string;
}
