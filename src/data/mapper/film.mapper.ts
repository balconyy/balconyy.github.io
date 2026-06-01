import {FilmDto} from "../dto/filmDTO";
import {MovieFull} from "../../models/movie.full";

export class FilmMapper {
    static toMovieFull(film: FilmDto): MovieFull {
        return {
            kpId: String(film.kinopoiskId),
            titleMain: film.nameRu,
            titleSecond: film.nameOriginal ?? undefined,
            posterUrl: film.posterUrl || undefined,
            year: film.year ? String(film.year) : undefined,
            type: film.type || undefined,
            imdbId: film.imdbId ?? undefined,
            ratingKp: film.ratingKinopoisk !== null
                    ? String(film.ratingKinopoisk)
                    : undefined,

            ratingImdb:
                film.ratingImdb !== null
                    ? String(film.ratingImdb)
                    : undefined,
            kpVoteCount: film.ratingKinopoiskVoteCount ?? undefined,
            imdbVoteCount: film.ratingImdbVoteCount ?? undefined,
        };
    }
}