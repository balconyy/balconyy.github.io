import {FilmDto} from "../dto/filmDTO";
import {Movie, MovieExtended} from "@/models/movie";

export class FilmMapper {
    static toMovieExtended(film: FilmDto): MovieExtended {
        const baseMovie: Movie = {
            kpId: film.kinopoiskId,
            titleMain: film.nameRu,
            titleSecond: film.nameOriginal ?? undefined,
            posterUrl: film.posterUrl || undefined,
            year: film.year ? String(film.year) : undefined,
            type: film.type || undefined,
            ratingKP: film.ratingKinopoisk !== null
                ? String(film.ratingKinopoisk)
                : undefined,
        };
        return {
            ...baseMovie,
            imdbId: film.imdbId || undefined,
            ratingKp: film.ratingKinopoisk !== null
                ? String(film.ratingKinopoisk)
                : undefined,
            ratingImdb: film.ratingImdb !== null
                ? String(film.ratingImdb)
                : undefined,
            kpVoteCount: film.ratingKinopoiskVoteCount ?? undefined,
            imdbVoteCount: film.ratingImdbVoteCount ?? undefined,
        };
    }
}