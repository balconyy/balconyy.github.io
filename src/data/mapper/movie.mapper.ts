import {Movie} from "../../models/movie";
import {MovieDTO} from "../dto/movieDTO";


export class MovieMapper {
    static toDomain(dto: MovieDTO): Movie {
        return {
            id: dto.filmId,
            titleMain: dto.nameRu,
            titleSecond: dto.nameEn,
            posterUrl: dto.posterUrl,
            year: dto.year,
            type: dto.type,
            ratingKP: dto.rating,
        };
    }

    static toDomainList(dtoList: MovieDTO[]): Movie[] {
        return dtoList.map(this.toDomain);
    }
}