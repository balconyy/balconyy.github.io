import {CountryDto, GenreDto} from "./searchDTO";

export interface FilmDto {
    kinopoiskId: number;
    kinopoiskHDId: string;
    imdbId: string | null;

    nameRu: string | null;
    nameEn: string | null;
    nameOriginal: string | null;

    posterUrl: string;
    posterUrlPreview: string;
    coverUrl: string;
    logoUrl: string | null;

    reviewsCount: number;

    ratingGoodReview: number | null;
    ratingGoodReviewVoteCount: number;

    ratingKinopoisk: number | null;
    ratingKinopoiskVoteCount: number;

    ratingImdb: number | null;
    ratingImdbVoteCount: number;

    ratingFilmCritics: number | null;
    ratingFilmCriticsVoteCount: number;

    ratingAwait: number | null;
    ratingAwaitCount: number;

    ratingRfCritics: number | null;
    ratingRfCriticsVoteCount: number;

    webUrl: string;

    year: number;

    filmLength: number;

    slogan: string | null;
    description: string | null;
    shortDescription: string | null;
    editorAnnotation: string | null;

    isTicketsAvailable: boolean;

    productionStatus: string | null;

    type: "FILM" | string;

    ratingMpaa: string | null;
    ratingAgeLimits: string | null;

    countries: CountryDto[];
    genres: GenreDto[];

    startYear: number | null;
    endYear: number | null;

    serial: boolean;
    shortFilm: boolean;
    completed: boolean;

    hasImax: boolean;
    has3D: boolean;

    lastSync: string;
}
