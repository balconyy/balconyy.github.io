import {MovieInfoDto} from "../dto/filmDTO";
import {MovieExtended} from "@/models/movie";

export class MovieInfoMapper {
    static toMovieExtended(dto: MovieInfoDto): MovieExtended {
        return {
            kpId: dto.kpId,
            titleMain: dto.titleMain,
            titleSecond: dto.titleSub,
            posterUrl: dto.posterUrl,
            year: dto.year?.toString(),
            type: dto.type,
            imdbId: dto.imdbId,
            ratingKp: dto.ratingKinopoisk?.toString(),
            ratingImdb: dto.ratingImdb?.toString(),
            kpVoteCount: dto.ratingKinopoiskVoteCount,
            imdbVoteCount: dto.ratingImdbVoteCount,
        }
    }
}