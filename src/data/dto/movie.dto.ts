export interface MovieResponseDTO {
    id: number;
    title: string;
    year: string;
    poster: string;
    raw_data: RawDataDTO;
    average_rating: number;
}

export interface RawDataDTO {
    film_id: number;
    name_ru: string | null;
    name_en: string | null;
    type: string;
    year: string;
    film_length: string;
    countries: CountryDTO[];
    genres: GenreDTO[];
    rating: string;
    rating_vote_count: number;
    poster_url: string;
    poster_url_preview: string;
}

export interface CountryDTO {
    country: string;
}

export interface GenreDTO {
    genre: string;
}