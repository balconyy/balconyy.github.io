import {MovieResponseDTO} from "../dto/movie.dto";
import {Movie} from "../../models/movie";


export class MovieMapper {
    static toDomain(dto: MovieResponseDTO): Movie {
        const raw = dto.raw_data;
        return {
            id: dto.id,
            titleMain: raw.name_ru,
            titleSecond: raw.name_en,
            posterUrl: dto.poster,
            year: dto.year,
            ratingKP: raw.rating,
        };
    }

    static toDomainList(dtoList: MovieResponseDTO[]): Movie[] {
        return dtoList.map(this.toDomain);
    }
}