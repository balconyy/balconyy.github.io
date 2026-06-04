import {CountryDto, GenreDto} from "./searchDTO";

export interface FilmDto {
    kinopoiskId: number;
    kinopoiskHDId: string | null;
    imdbId: string | null;
    nameRu: string | null;
    nameEn: string | null;
    nameOriginal: string | null;
    posterUrl: string | null;
    posterUrlPreview: string | null;
    coverUrl: string | null;
    logoUrl: string | null;
    reviewsCount: number | null;
    ratingGoodReview: number | null;
    ratingGoodReviewVoteCount: number | null;
    ratingKinopoisk: number | null;
    ratingKinopoiskVoteCount: number | null;
    ratingImdb: number | null;
    ratingImdbVoteCount: number;
    ratingFilmCritics: number | null;
    ratingFilmCriticsVoteCount: number | null;
    ratingAwait: number | null;
    ratingAwaitCount: number | null;
    ratingRfCritics: number | null;
    ratingRfCriticsVoteCount: number | null;
    webUrl: string | null;
    year: number | null;
    filmLength: number | null;
    slogan: string | null;
    description: string | null;
    shortDescription: string | null;
    editorAnnotation: string | null;
    isTicketsAvailable: boolean | null;
    productionStatus: string | null;
    type: string;
    ratingMpaa: string | null;
    ratingAgeLimits: string | null;
    countries: CountryDto[];
    genres: GenreDto[];
    startYear: number | null;
    endYear: number | null;
    serial: boolean | null;
    shortFilm: boolean | null;
    completed: boolean | null;
    hasImax: boolean | null;
    has3D: boolean | null;
    lastSync: string | null;
    timings: TimingDto[];
}

export interface TimingDto {
    username: string;
    timingText: string;
}
