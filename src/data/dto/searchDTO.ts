export interface SearchListDTO {
    films: SearchDTO[]
}


export interface SearchDTO {
    filmId: number;
    nameRu: string;
    nameEn: string;
    type: string;
    year: string;
    description: string;
    filmLength: string;
    countries: CountryDto[];
    genres: GenreDto[];
    rating: string;
    ratingVoteCount: number;
    posterUrl: string;
    posterUrlPreview: string;
}

export interface CountryDto {
    country: string;
}

export interface GenreDto {
    genre: string;
}
